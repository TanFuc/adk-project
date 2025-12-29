import { Injectable, NotFoundException, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { MoHinhKinhDoanh } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMoHinhKinhDoanhDto, UpdateMoHinhKinhDoanhDto, ReorderDto } from "./dto";

@Injectable()
export class MoHinhKinhDoanhService {
  private readonly logger = new Logger(MoHinhKinhDoanhService.name);
  private readonly CACHE_KEY = "mo-hinh-kinh-doanh";
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAllPublic(): Promise<MoHinhKinhDoanh[]> {
    const cacheKey = `${this.CACHE_KEY}:public`;
    const cached = await this.cache.get<MoHinhKinhDoanh[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.prisma.moHinhKinhDoanh.findMany({
      where: { hienThi: true },
      orderBy: { thuTu: "asc" },
    });

    await this.cache.set(cacheKey, data, this.CACHE_TTL);

    return data;
  }

  async findOnePublic(id: string): Promise<MoHinhKinhDoanh> {
    const data = await this.prisma.moHinhKinhDoanh.findFirst({
      where: { id, hienThi: true },
    });

    if (!data) {
      throw new NotFoundException("Không tìm thấy mô hình kinh doanh với ID này.");
    }

    return data;
  }

  async findAll(): Promise<MoHinhKinhDoanh[]> {
    return this.prisma.moHinhKinhDoanh.findMany({
      orderBy: { thuTu: "asc" },
    });
  }

  async findOne(id: string): Promise<MoHinhKinhDoanh> {
    const data = await this.prisma.moHinhKinhDoanh.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException("Không tìm thấy mô hình kinh doanh với ID này.");
    }

    return data;
  }

  async create(dto: CreateMoHinhKinhDoanhDto): Promise<MoHinhKinhDoanh> {
    const data = await this.prisma.moHinhKinhDoanh.create({
      data: {
        ten: dto.ten,
        moTa: dto.moTa,
        anhIcon: dto.anhIcon,
        tiemNangLoiNhuan: dto.tiemNangLoiNhuan,
        thuTu: dto.thuTu ?? 0,
        hienThi: dto.hienThi ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Tạo mô hình kinh doanh mới: ${data.id} - ${dto.ten}`);

    return data;
  }

  async update(id: string, dto: UpdateMoHinhKinhDoanhDto): Promise<MoHinhKinhDoanh> {
    const existing = await this.prisma.moHinhKinhDoanh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy mô hình kinh doanh với ID này.");
    }

    const data = await this.prisma.moHinhKinhDoanh.update({
      where: { id },
      data: {
        ten: dto.ten,
        moTa: dto.moTa,
        anhIcon: dto.anhIcon,
        tiemNangLoiNhuan: dto.tiemNangLoiNhuan,
        thuTu: dto.thuTu,
        hienThi: dto.hienThi,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Cập nhật mô hình kinh doanh: ${id}`);

    return data;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.moHinhKinhDoanh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy mô hình kinh doanh với ID này.");
    }

    await this.prisma.moHinhKinhDoanh.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Xóa mô hình kinh doanh: ${id}`);
  }

  async toggleVisibility(id: string): Promise<MoHinhKinhDoanh> {
    const existing = await this.prisma.moHinhKinhDoanh.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy mô hình kinh doanh với ID này.");
    }

    const data = await this.prisma.moHinhKinhDoanh.update({
      where: { id },
      data: { hienThi: !existing.hienThi },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle hiển thị mô hình kinh doanh: ${id} -> ${data.hienThi}`);

    return data;
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.moHinhKinhDoanh.update({
          where: { id: item.id },
          data: { thuTu: item.thuTu },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Sắp xếp lại ${dto.items.length} mô hình kinh doanh`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.(`${this.CACHE_KEY}:*`);
    if (keys && keys.length > 0) {
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
    await this.cache.del(`${this.CACHE_KEY}:public`);
  }
}
