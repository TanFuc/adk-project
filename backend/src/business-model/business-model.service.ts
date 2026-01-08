import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BusinessModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessModelDto, UpdateBusinessModelDto, ReorderDto } from './dto';

@Injectable()
export class BusinessModelService {
  private readonly logger = new Logger(BusinessModelService.name);
  private readonly CACHE_KEY = 'business-model';
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAllPublic(): Promise<BusinessModel[]> {
    const cacheKey = `${this.CACHE_KEY}:public`;
    const cached = await this.cache.get<BusinessModel[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.prisma.businessModel.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    await this.cache.set(cacheKey, data, this.CACHE_TTL);

    return data;
  }

  async findOnePublic(id: string): Promise<BusinessModel> {
    const data = await this.prisma.businessModel.findFirst({
      where: { id, isVisible: true },
    });

    if (!data) {
      throw new NotFoundException('Business model not found with this ID.');
    }

    return data;
  }

  async findAll(): Promise<BusinessModel[]> {
    return this.prisma.businessModel.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string): Promise<BusinessModel> {
    const data = await this.prisma.businessModel.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException('Business model not found with this ID.');
    }

    return data;
  }

  async create(dto: CreateBusinessModelDto): Promise<BusinessModel> {
    const data = await this.prisma.businessModel.create({
      data: {
        name: dto.name,
        description: dto.description,
        iconUrl: dto.iconUrl,
        profitPotential: dto.profitPotential,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new business model: ${data.id} - ${dto.name}`);

    return data;
  }

  async update(id: string, dto: UpdateBusinessModelDto): Promise<BusinessModel> {
    const existing = await this.prisma.businessModel.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Business model not found with this ID.');
    }

    const data = await this.prisma.businessModel.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        iconUrl: dto.iconUrl,
        profitPotential: dto.profitPotential,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Updated business model: ${id}`);

    return data;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.businessModel.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Business model not found with this ID.');
    }

    await this.prisma.businessModel.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted business model: ${id}`);
  }

  async toggleVisibility(id: string): Promise<BusinessModel> {
    const existing = await this.prisma.businessModel.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Business model not found with this ID.');
    }

    const data = await this.prisma.businessModel.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle business model visibility: ${id} -> ${data.isVisible}`);

    return data;
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map(item =>
        this.prisma.businessModel.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Reordered ${dto.items.length} business models`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.(`${this.CACHE_KEY}:*`);
    if (keys && keys.length > 0) {
      await Promise.all(keys.map(key => this.cache.del(key)));
    }
    await this.cache.del(`${this.CACHE_KEY}:public`);
  }
}
