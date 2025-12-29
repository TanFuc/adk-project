import { Injectable, NotFoundException, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { HoiDapHopTac } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHoiDapHopTacDto, UpdateHoiDapHopTacDto, ReorderDto } from "./dto";

@Injectable()
export class HoiDapHopTacService {
  private readonly logger = new Logger(HoiDapHopTacService.name);
  private readonly CACHE_KEY = "hoi-dap-hop-tac";
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAllPublic(): Promise<HoiDapHopTac[]> {
    const cacheKey = `${this.CACHE_KEY}:public`;
    const cached = await this.cache.get<HoiDapHopTac[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.prisma.hoiDapHopTac.findMany({
      where: { hienThi: true },
      orderBy: { thuTu: "asc" },
    });

    await this.cache.set(cacheKey, data, this.CACHE_TTL);

    return data;
  }

  async findAll(): Promise<HoiDapHopTac[]> {
    return this.prisma.hoiDapHopTac.findMany({
      orderBy: { thuTu: "asc" },
    });
  }

  async findOne(id: string): Promise<HoiDapHopTac> {
    const data = await this.prisma.hoiDapHopTac.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException("Không tìm thấy câu hỏi với ID này.");
    }

    return data;
  }

  async create(dto: CreateHoiDapHopTacDto): Promise<HoiDapHopTac> {
    const data = await this.prisma.hoiDapHopTac.create({
      data: {
        cauHoi: dto.cauHoi,
        traLoi: dto.traLoi,
        thuTu: dto.thuTu ?? 0,
        hienThi: dto.hienThi ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Tạo hỏi đáp mới: ${data.id}`);

    return data;
  }

  async update(id: string, dto: UpdateHoiDapHopTacDto): Promise<HoiDapHopTac> {
    const existing = await this.prisma.hoiDapHopTac.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy câu hỏi với ID này.");
    }

    const data = await this.prisma.hoiDapHopTac.update({
      where: { id },
      data: {
        cauHoi: dto.cauHoi,
        traLoi: dto.traLoi,
        thuTu: dto.thuTu,
        hienThi: dto.hienThi,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Cập nhật hỏi đáp: ${id}`);

    return data;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.hoiDapHopTac.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy câu hỏi với ID này.");
    }

    await this.prisma.hoiDapHopTac.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Xóa hỏi đáp: ${id}`);
  }

  async toggleVisibility(id: string): Promise<HoiDapHopTac> {
    const existing = await this.prisma.hoiDapHopTac.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Không tìm thấy câu hỏi với ID này.");
    }

    const data = await this.prisma.hoiDapHopTac.update({
      where: { id },
      data: { hienThi: !existing.hienThi },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle hiển thị hỏi đáp: ${id} -> ${data.hienThi}`);

    return data;
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.hoiDapHopTac.update({
          where: { id: item.id },
          data: { thuTu: item.thuTu },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Sắp xếp lại ${dto.items.length} câu hỏi`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.(`${this.CACHE_KEY}:*`);
    if (keys && keys.length > 0) {
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
    await this.cache.del(`${this.CACHE_KEY}:public`);
  }
}
