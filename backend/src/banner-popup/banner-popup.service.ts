import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BannerPopup } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerPopupDto, UpdateBannerPopupDto } from './dto';

@Injectable()
export class BannerPopupService {
  private readonly logger = new Logger(BannerPopupService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findActivePopup(): Promise<BannerPopup | null> {
    const cacheKey = 'banner-popup:active';
    const cached = await this.cache.get<BannerPopup>(cacheKey);

    if (cached) {
      return cached;
    }

    const popup = await this.prisma.bannerPopup.findFirst({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });

    if (popup) {
      await this.cache.set(cacheKey, popup, 300000);
    }

    return popup;
  }

  async findAllActive(): Promise<BannerPopup[]> {
    const cacheKey = 'banner-popup:all-active';
    const cached = await this.cache.get<BannerPopup[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const popups = await this.prisma.bannerPopup.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });

    await this.cache.set(cacheKey, popups, 300000);

    return popups;
  }

  async findAll(): Promise<BannerPopup[]> {
    return this.prisma.bannerPopup.findMany({
      orderBy: [{ isActive: 'desc' }, { priority: 'asc' }],
    });
  }

  async findOne(id: string): Promise<BannerPopup> {
    const popup = await this.prisma.bannerPopup.findUnique({
      where: { id },
    });

    if (!popup) {
      throw new NotFoundException('Banner popup not found with this ID.');
    }

    return popup;
  }

  async create(dto: CreateBannerPopupDto): Promise<BannerPopup> {
    const popup = await this.prisma.bannerPopup.create({
      data: {
        imageUrl: dto.imageUrl,
        redirectUrl: dto.redirectUrl,
        isActive: dto.isActive ?? true,
        displayDelay: dto.displayDelay ?? 3000,
        priority: dto.priority ?? 0,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new banner popup: ${popup.id}`);

    return popup;
  }

  async update(id: string, dto: UpdateBannerPopupDto): Promise<BannerPopup> {
    const existing = await this.prisma.bannerPopup.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Banner popup not found with this ID.');
    }

    const popup = await this.prisma.bannerPopup.update({
      where: { id },
      data: dto,
    });

    await this.invalidateCaches();

    this.logger.log(`Updated banner popup: ${id}`);

    return popup;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.bannerPopup.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Banner popup not found with this ID.');
    }

    await this.prisma.bannerPopup.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted banner popup: ${id}`);
  }

  async toggleActive(id: string): Promise<BannerPopup> {
    const existing = await this.prisma.bannerPopup.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Banner popup not found with this ID.');
    }

    const popup = await this.prisma.bannerPopup.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle banner popup: ${id} -> ${popup.isActive}`);

    return popup;
  }

  private async invalidateCaches(): Promise<void> {
    await Promise.all([
      this.cache.del('banner-popup:active'),
      this.cache.del('banner-popup:all-active'),
    ]);
  }
}
