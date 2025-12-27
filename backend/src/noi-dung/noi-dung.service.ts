import {
  Injectable,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoaiNoiDung, NoiDung } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoiDungDto, UpdateNoiDungDto } from './dto';

@Injectable()
export class NoiDungService {
  private readonly logger = new Logger(NoiDungService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findByLoai(loai: LoaiNoiDung): Promise<NoiDung[]> {
    const cacheKey = `noi-dung:${loai}`;
    const cached = await this.cache.get<NoiDung[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const noiDung = await this.prisma.noiDung.findMany({
      where: { loai, hienThi: true },
      orderBy: { thuTu: 'asc' },
    });

    // Cache for 5 minutes
    await this.cache.set(cacheKey, noiDung, 300000);

    return noiDung;
  }

  async findAll(): Promise<NoiDung[]> {
    const cacheKey = 'noi-dung:all';
    const cached = await this.cache.get<NoiDung[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const noiDung = await this.prisma.noiDung.findMany({
      orderBy: [{ loai: 'asc' }, { thuTu: 'asc' }],
    });

    // Cache for 5 minutes
    await this.cache.set(cacheKey, noiDung, 300000);

    return noiDung;
  }

  async findPublic(): Promise<Record<string, NoiDung[]>> {
    const cacheKey = 'noi-dung:public';
    const cached = await this.cache.get<Record<string, NoiDung[]>>(cacheKey);

    if (cached) {
      return cached;
    }

    const allContent = await this.prisma.noiDung.findMany({
      where: { hienThi: true },
      orderBy: { thuTu: 'asc' },
    });

    // Group by loai
    const grouped: Record<string, NoiDung[]> = {};
    for (const content of allContent) {
      if (!grouped[content.loai]) {
        grouped[content.loai] = [];
      }
      grouped[content.loai].push(content);
    }

    // Cache for 5 minutes
    await this.cache.set(cacheKey, grouped, 300000);

    return grouped;
  }

  async findOne(id: string): Promise<NoiDung> {
    const noiDung = await this.prisma.noiDung.findUnique({
      where: { id },
    });

    if (!noiDung) {
      throw new NotFoundException('Không tìm thấy nội dung với ID này.');
    }

    return noiDung;
  }

  async create(dto: CreateNoiDungDto): Promise<NoiDung> {
    const noiDung = await this.prisma.noiDung.create({
      data: {
        loai: dto.loai,
        tieuDe: dto.tieuDe,
        moTa: dto.moTa,
        noiDung: dto.noiDung,
        thuTu: dto.thuTu ?? 0,
        hienThi: dto.hienThi ?? true,
      },
    });

    // Invalidate caches
    await this.invalidateCaches(dto.loai);

    this.logger.log(`Tạo nội dung mới: ${noiDung.id} - ${dto.loai}`);

    return noiDung;
  }

  async update(id: string, dto: UpdateNoiDungDto): Promise<NoiDung> {
    const existing = await this.prisma.noiDung.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy nội dung với ID này.');
    }

    const noiDung = await this.prisma.noiDung.update({
      where: { id },
      data: dto,
    });

    // Invalidate caches
    await this.invalidateCaches(existing.loai);

    this.logger.log(`Cập nhật nội dung: ${id}`);

    return noiDung;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.noiDung.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy nội dung với ID này.');
    }

    await this.prisma.noiDung.delete({ where: { id } });

    // Invalidate caches
    await this.invalidateCaches(existing.loai);

    this.logger.log(`Xóa nội dung: ${id}`);
  }

  async reorder(loai: LoaiNoiDung, ids: string[]): Promise<NoiDung[]> {
    // Update order for each item
    const updates = ids.map((id, index) =>
      this.prisma.noiDung.update({
        where: { id },
        data: { thuTu: index },
      }),
    );

    const updated = await this.prisma.$transaction(updates);

    // Invalidate caches
    await this.invalidateCaches(loai);

    this.logger.log(`Sắp xếp lại nội dung: ${loai}`);

    return updated;
  }

  private async invalidateCaches(loai: LoaiNoiDung): Promise<void> {
    await Promise.all([
      this.cache.del(`noi-dung:${loai}`),
      this.cache.del('noi-dung:all'),
      this.cache.del('noi-dung:public'),
    ]);
  }
}
