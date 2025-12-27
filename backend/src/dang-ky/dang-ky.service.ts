import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { TrangThai } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDangKyDto,
  DangKyResponseDto,
  DangKyDetailDto,
  DangKyStatsDto,
} from './dto';
import { encrypt, decrypt, hashForSearch } from '../common/utils/encryption.util';

@Injectable()
export class DangKyService {
  private readonly logger = new Logger(DangKyService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateDangKyDto): Promise<DangKyResponseDto> {
    // 1. Check cache for duplicate (24h)
    const phoneHash = hashForSearch(dto.soDienThoai);
    const cacheKey = `dang-ky:${phoneHash}`;
    const cached = await this.cache.get<string>(cacheKey);

    if (cached) {
      this.logger.warn(`Đăng ký trùng (cache): ${dto.soDienThoai.slice(0, 4)}****`);
      throw new ConflictException(
        'Bạn đã đăng ký gần đây. Vui lòng chờ 24 giờ để đăng ký lại.',
      );
    }

    // 2. Check DB duplicate (24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get all registrations in last 24h and check phone hash
    const recentRegistrations = await this.prisma.dangKy.findMany({
      where: {
        createdAt: { gte: twentyFourHoursAgo },
      },
      select: { soDienThoai: true },
    });

    const isDuplicate = recentRegistrations.some((reg) => {
      try {
        const decryptedPhone = decrypt(reg.soDienThoai);
        return decryptedPhone === dto.soDienThoai;
      } catch {
        return false;
      }
    });

    if (isDuplicate) {
      this.logger.warn(`Đăng ký trùng (DB): ${dto.soDienThoai.slice(0, 4)}****`);
      throw new ConflictException(
        'Số điện thoại này đã đăng ký trong 24 giờ qua. Vui lòng thử lại sau.',
      );
    }

    // 3. Encrypt phone number
    const encryptedPhone = encrypt(dto.soDienThoai);

    // 4. Create registration
    const dangKy = await this.prisma.dangKy.create({
      data: {
        hoTen: dto.hoTen,
        soDienThoai: encryptedPhone,
        tinhThanh: dto.tinhThanh,
        quanHuyen: dto.quanHuyen,
        diaChi: dto.diaChi,
        trangThai: TrangThai.CHO_XU_LY,
        nguonDangKy: 'landing_page',
      },
      select: { id: true, hoTen: true },
    });

    // 5. Cache for 24h (86400000ms)
    await this.cache.set(cacheKey, dangKy.id, 86400000);

    // 6. Invalidate stats cache
    await this.cache.del('dang-ky:stats');

    // 7. Get redirect URL from config
    const redirectUrl = this.config.get<string>('REDIRECT_URL') || undefined;

    this.logger.log(`Đăng ký mới thành công: ${dangKy.id}`);

    return {
      id: dangKy.id,
      message: `Cảm ơn ${dangKy.hoTen}! Đăng ký thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.`,
      redirectUrl,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    trangThai?: TrangThai,
  ): Promise<{ data: DangKyDetailDto[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const where = trangThai ? { trangThai } : {};

    const [registrations, total] = await Promise.all([
      this.prisma.dangKy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dangKy.count({ where }),
    ]);

    const data: DangKyDetailDto[] = registrations.map((reg) => ({
      ...reg,
      soDienThoai: this.maskPhone(decrypt(reg.soDienThoai)),
      diaChi: reg.diaChi ?? undefined,
    }));

    return {
      data,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<DangKyDetailDto> {
    const registration = await this.prisma.dangKy.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Không tìm thấy đăng ký với ID này.');
    }

    return {
      ...registration,
      soDienThoai: decrypt(registration.soDienThoai),
      diaChi: registration.diaChi ?? undefined,
    };
  }

  async updateStatus(id: string, trangThai: TrangThai): Promise<DangKyDetailDto> {
    const existing = await this.prisma.dangKy.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy đăng ký với ID này.');
    }

    const updated = await this.prisma.dangKy.update({
      where: { id },
      data: { trangThai },
    });

    // Invalidate stats cache
    await this.cache.del('dang-ky:stats');

    this.logger.log(`Cập nhật trạng thái đăng ký ${id}: ${trangThai}`);

    return {
      ...updated,
      soDienThoai: this.maskPhone(decrypt(updated.soDienThoai)),
      diaChi: updated.diaChi ?? undefined,
    };
  }

  async getStats(): Promise<DangKyStatsDto> {
    const cacheKey = 'dang-ky:stats';
    const cached = await this.cache.get<DangKyStatsDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const [total, choXuLy, daLienHe, thanhCong, tuChoi] = await Promise.all([
      this.prisma.dangKy.count(),
      this.prisma.dangKy.count({ where: { trangThai: TrangThai.CHO_XU_LY } }),
      this.prisma.dangKy.count({ where: { trangThai: TrangThai.DA_LIEN_HE } }),
      this.prisma.dangKy.count({ where: { trangThai: TrangThai.THANH_CONG } }),
      this.prisma.dangKy.count({ where: { trangThai: TrangThai.TU_CHOI } }),
    ]);

    const stats: DangKyStatsDto = {
      total,
      choXuLy,
      daLienHe,
      thanhCong,
      tuChoi,
    };

    // Cache for 5 minutes
    await this.cache.set(cacheKey, stats, 300000);

    return stats;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.dangKy.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy đăng ký với ID này.');
    }

    await this.prisma.dangKy.delete({ where: { id } });

    // Invalidate stats cache
    await this.cache.del('dang-ky:stats');

    this.logger.log(`Xóa đăng ký: ${id}`);
  }

  private maskPhone(phone: string): string {
    if (phone.length < 6) return phone;
    return phone.slice(0, 4) + '****' + phone.slice(-2);
  }
}
