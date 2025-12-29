import { Injectable, NotFoundException, ConflictException, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { PhanMuc, LoaiBoCuc, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePhanMucDto, UpdatePhanMucDto, ReorderDto } from "./dto";

@Injectable()
export class PhanMucService {
  private readonly logger = new Logger(PhanMucService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findByKey(key: string): Promise<PhanMuc | null> {
    const cacheKey = `phan-muc:key:${key}`;
    const cached = await this.cache.get<PhanMuc>(cacheKey);

    if (cached) {
      return cached;
    }

    const phanMuc = await this.prisma.phanMuc.findUnique({
      where: { key, hienThi: true },
    });

    if (phanMuc) {
      await this.cache.set(cacheKey, phanMuc, 300000);
    }

    return phanMuc;
  }

  async findByLoaiBoCuc(loaiBoCuc: LoaiBoCuc): Promise<PhanMuc[]> {
    const cacheKey = `phan-muc:loai:${loaiBoCuc}`;
    const cached = await this.cache.get<PhanMuc[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const phanMuc = await this.prisma.phanMuc.findMany({
      where: { loaiBoCuc, hienThi: true },
      orderBy: { thuTu: "asc" },
    });

    await this.cache.set(cacheKey, phanMuc, 300000);

    return phanMuc;
  }

  async findAllPublic(): Promise<PhanMuc[]> {
    const cacheKey = "phan-muc:public";
    const cached = await this.cache.get<PhanMuc[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const phanMuc = await this.prisma.phanMuc.findMany({
      where: { hienThi: true },
      orderBy: { thuTu: "asc" },
    });

    await this.cache.set(cacheKey, phanMuc, 300000);

    return phanMuc;
  }

  async findAll(): Promise<PhanMuc[]> {
    return this.prisma.phanMuc.findMany({
      orderBy: [{ loaiBoCuc: "asc" }, { thuTu: "asc" }],
    });
  }

  async findOne(id: string): Promise<PhanMuc> {
    const phanMuc = await this.prisma.phanMuc.findUnique({
      where: { id },
    });

    if (!phanMuc) {
      throw new NotFoundException("Không tìm thấy phần mục với ID này.");
    }

    return phanMuc;
  }

  async create(dto: CreatePhanMucDto): Promise<PhanMuc> {
    const existing = await this.prisma.phanMuc.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Key "${dto.key}" đã tồn tại.`);
    }

    const phanMuc = await this.prisma.phanMuc.create({
      data: {
        key: dto.key,
        loaiBoCuc: dto.loaiBoCuc,
        noiDung: dto.noiDung as Prisma.InputJsonValue,
        hinhAnh: dto.hinhAnh ?? [],
        ctaLink: dto.ctaLink,
        thuTu: dto.thuTu ?? 0,
        hienThi: dto.hienThi ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Tạo phần mục mới: ${phanMuc.id} - ${dto.key}`);

    return phanMuc;
  }

  async update(id: string, dto: UpdatePhanMucDto): Promise<PhanMuc> {
    const existing = await this.prisma.phanMuc.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy phần mục với ID này.");
    }

    const phanMuc = await this.prisma.phanMuc.update({
      where: { id },
      data: {
        loaiBoCuc: dto.loaiBoCuc,
        noiDung: dto.noiDung ? (dto.noiDung as Prisma.InputJsonValue) : undefined,
        hinhAnh: dto.hinhAnh,
        ctaLink: dto.ctaLink,
        thuTu: dto.thuTu,
        hienThi: dto.hienThi,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Cập nhật phần mục: ${id}`);

    return phanMuc;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.phanMuc.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy phần mục với ID này.");
    }

    await this.prisma.phanMuc.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Xóa phần mục: ${id}`);
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.phanMuc.update({
          where: { id: item.id },
          data: { thuTu: item.thuTu },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Sắp xếp lại ${dto.items.length} phần mục`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.("phan-muc:*");
    if (keys && keys.length > 0) {
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
    await this.cache.del("phan-muc:public");
  }
}
