import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CauHinh } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCauHinhDto, UpdateCauHinhDto } from './dto';

@Injectable()
export class CauHinhService {
  private readonly logger = new Logger(CauHinhService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(): Promise<CauHinh[]> {
    const cacheKey = 'cau-hinh:all';
    const cached = await this.cache.get<CauHinh[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const cauHinh = await this.prisma.cauHinh.findMany();

    // Cache for 10 minutes
    await this.cache.set(cacheKey, cauHinh, 600000);

    return cauHinh;
  }

  async findByKey(key: string): Promise<CauHinh> {
    const cacheKey = `cau-hinh:${key}`;
    const cached = await this.cache.get<CauHinh>(cacheKey);

    if (cached) {
      return cached;
    }

    const cauHinh = await this.prisma.cauHinh.findUnique({
      where: { key },
    });

    if (!cauHinh) {
      throw new NotFoundException(`Không tìm thấy cấu hình với key: ${key}`);
    }

    // Cache for 10 minutes
    await this.cache.set(cacheKey, cauHinh, 600000);

    return cauHinh;
  }

  async findPublic(): Promise<Record<string, unknown>> {
    const cacheKey = 'cau-hinh:public';
    const cached = await this.cache.get<Record<string, unknown>>(cacheKey);

    if (cached) {
      return cached;
    }

    const allConfig = await this.prisma.cauHinh.findMany();

    // Convert to key-value object
    const configMap: Record<string, unknown> = {};
    for (const config of allConfig) {
      configMap[config.key] = config.value;
    }

    // Cache for 10 minutes
    await this.cache.set(cacheKey, configMap, 600000);

    return configMap;
  }

  async create(dto: CreateCauHinhDto): Promise<CauHinh> {
    // Check if key already exists
    const existing = await this.prisma.cauHinh.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Key "${dto.key}" đã tồn tại.`);
    }

    const cauHinh = await this.prisma.cauHinh.create({
      data: dto,
    });

    // Invalidate caches
    await this.invalidateCaches(dto.key);

    this.logger.log(`Tạo cấu hình mới: ${dto.key}`);

    return cauHinh;
  }

  async update(key: string, dto: UpdateCauHinhDto): Promise<CauHinh> {
    const existing = await this.prisma.cauHinh.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy cấu hình với key: ${key}`);
    }

    const cauHinh = await this.prisma.cauHinh.update({
      where: { key },
      data: dto,
    });

    // Invalidate caches
    await this.invalidateCaches(key);

    this.logger.log(`Cập nhật cấu hình: ${key}`);

    return cauHinh;
  }

  async delete(key: string): Promise<void> {
    const existing = await this.prisma.cauHinh.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy cấu hình với key: ${key}`);
    }

    await this.prisma.cauHinh.delete({ where: { key } });

    // Invalidate caches
    await this.invalidateCaches(key);

    this.logger.log(`Xóa cấu hình: ${key}`);
  }

  private async invalidateCaches(key: string): Promise<void> {
    await Promise.all([
      this.cache.del(`cau-hinh:${key}`),
      this.cache.del('cau-hinh:all'),
      this.cache.del('cau-hinh:public'),
    ]);
  }
}
