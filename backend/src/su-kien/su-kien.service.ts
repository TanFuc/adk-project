import { Injectable, NotFoundException, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { SuKien, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSuKienDto, UpdateSuKienDto } from "./dto";

@Injectable()
export class SuKienService {
  private readonly logger = new Logger(SuKienService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findFeatured(): Promise<SuKien[]> {
    const cacheKey = "su-kien:featured";
    const cached = await this.cache.get<SuKien[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const suKien = await this.prisma.suKien.findMany({
      where: { noiBat: true, hienThi: true },
      orderBy: { ngayBatDau: "desc" },
      take: 5,
    });

    await this.cache.set(cacheKey, suKien, 300000);

    return suKien;
  }

  async findUpcoming(): Promise<SuKien[]> {
    const cacheKey = "su-kien:upcoming";
    const cached = await this.cache.get<SuKien[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const suKien = await this.prisma.suKien.findMany({
      where: {
        hienThi: true,
        ngayBatDau: { gte: now },
      },
      orderBy: { ngayBatDau: "asc" },
    });

    await this.cache.set(cacheKey, suKien, 300000);

    return suKien;
  }

  async findPast(): Promise<SuKien[]> {
    const cacheKey = "su-kien:past";
    const cached = await this.cache.get<SuKien[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const suKien = await this.prisma.suKien.findMany({
      where: {
        hienThi: true,
        OR: [{ ngayKetThuc: { lt: now } }, { ngayKetThuc: null, ngayBatDau: { lt: now } }],
      },
      orderBy: { ngayBatDau: "desc" },
    });

    await this.cache.set(cacheKey, suKien, 300000);

    return suKien;
  }

  async findAllPublic(): Promise<SuKien[]> {
    const cacheKey = "su-kien:public";
    const cached = await this.cache.get<SuKien[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const suKien = await this.prisma.suKien.findMany({
      where: { hienThi: true },
      orderBy: { ngayBatDau: "desc" },
    });

    await this.cache.set(cacheKey, suKien, 300000);

    return suKien;
  }

  async findAll(): Promise<SuKien[]> {
    return this.prisma.suKien.findMany({
      orderBy: { ngayBatDau: "desc" },
    });
  }

  async findOne(id: string): Promise<SuKien> {
    const suKien = await this.prisma.suKien.findUnique({
      where: { id },
    });

    if (!suKien) {
      throw new NotFoundException("Không tìm thấy sự kiện với ID này.");
    }

    return suKien;
  }

  async findOnePublic(id: string): Promise<SuKien> {
    const suKien = await this.prisma.suKien.findUnique({
      where: { id, hienThi: true },
    });

    if (!suKien) {
      throw new NotFoundException("Không tìm thấy sự kiện với ID này.");
    }

    return suKien;
  }

  async create(dto: CreateSuKienDto): Promise<SuKien> {
    const suKien = await this.prisma.suKien.create({
      data: {
        tieuDe: dto.tieuDe,
        moTa: dto.moTa,
        ngayBatDau: new Date(dto.ngayBatDau),
        ngayKetThuc: dto.ngayKetThuc ? new Date(dto.ngayKetThuc) : null,
        anhBia: dto.anhBia,
        boSuuTapAnh: dto.boSuuTapAnh ?? [],
        noiDung: (dto.noiDung ?? {}) as Prisma.InputJsonValue,
        noiBat: dto.noiBat ?? false,
        hienThi: dto.hienThi ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Tạo sự kiện mới: ${suKien.id} - ${dto.tieuDe}`);

    return suKien;
  }

  async update(id: string, dto: UpdateSuKienDto): Promise<SuKien> {
    const existing = await this.prisma.suKien.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy sự kiện với ID này.");
    }

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.ngayBatDau) {
      updateData.ngayBatDau = new Date(dto.ngayBatDau);
    }
    if (dto.ngayKetThuc !== undefined) {
      updateData.ngayKetThuc = dto.ngayKetThuc ? new Date(dto.ngayKetThuc) : null;
    }

    const suKien = await this.prisma.suKien.update({
      where: { id },
      data: updateData,
    });

    await this.invalidateCaches();

    this.logger.log(`Cập nhật sự kiện: ${id}`);

    return suKien;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.suKien.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy sự kiện với ID này.");
    }

    await this.prisma.suKien.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Xóa sự kiện: ${id}`);
  }

  async toggleFeatured(id: string): Promise<SuKien> {
    const existing = await this.prisma.suKien.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy sự kiện với ID này.");
    }

    const suKien = await this.prisma.suKien.update({
      where: { id },
      data: { noiBat: !existing.noiBat },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle sự kiện nổi bật: ${id} -> ${suKien.noiBat}`);

    return suKien;
  }

  private async invalidateCaches(): Promise<void> {
    await Promise.all([
      this.cache.del("su-kien:featured"),
      this.cache.del("su-kien:upcoming"),
      this.cache.del("su-kien:past"),
      this.cache.del("su-kien:public"),
    ]);
  }
}
