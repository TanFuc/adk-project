import { Injectable, NotFoundException, ConflictException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PhotoCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoCategoryDto, UpdatePhotoCategoryDto, ReorderDto } from './dto';

@Injectable()
export class PhotoCategoryService {
  private readonly logger = new Logger(PhotoCategoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAllPublic(): Promise<(PhotoCategory & { photoCount: number })[]> {
    const cacheKey = 'photo-category:public';
    const cached = await this.cache.get<(PhotoCategory & { photoCount: number })[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const categories = await this.prisma.photoCategory.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { photos: { where: { isVisible: true } } },
        },
      },
    });

    const result = categories.map(cat => ({
      ...cat,
      photoCount: cat._count.photos,
      _count: undefined,
    }));

    await this.cache.set(cacheKey, result, 300000);

    return result;
  }

  async findBySlug(slug: string): Promise<PhotoCategory | null> {
    const cacheKey = `photo-category:slug:${slug}`;
    const cached = await this.cache.get<PhotoCategory>(cacheKey);

    if (cached) {
      return cached;
    }

    const category = await this.prisma.photoCategory.findUnique({
      where: { slug, isVisible: true },
    });

    if (category) {
      await this.cache.set(cacheKey, category, 300000);
    }

    return category;
  }

  async findAll(): Promise<PhotoCategory[]> {
    return this.prisma.photoCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<PhotoCategory> {
    const category = await this.prisma.photoCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Photo category not found with this ID.');
    }

    return category;
  }

  async create(dto: CreatePhotoCategoryDto): Promise<PhotoCategory> {
    const existing = await this.prisma.photoCategory.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" already exists.`);
    }

    const category = await this.prisma.photoCategory.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new photo category: ${category.id} - ${dto.name}`);

    return category;
  }

  async update(id: string, dto: UpdatePhotoCategoryDto): Promise<PhotoCategory> {
    const existing = await this.prisma.photoCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Photo category not found with this ID.');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.prisma.photoCategory.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException(`Slug "${dto.slug}" already exists.`);
      }
    }

    const category = await this.prisma.photoCategory.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Updated photo category: ${id}`);

    return category;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.photoCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Photo category not found with this ID.');
    }

    await this.prisma.photoCategory.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted photo category: ${id}`);
  }

  async toggle(id: string): Promise<PhotoCategory> {
    const existing = await this.prisma.photoCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Photo category not found with this ID.');
    }

    const category = await this.prisma.photoCategory.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggled photo category visibility: ${id} -> ${category.isVisible}`);

    return category;
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map(item =>
        this.prisma.photoCategory.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Reordered ${dto.items.length} photo categories`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.('photo-category:*');
    if (keys && keys.length > 0) {
      await Promise.all(keys.map(key => this.cache.del(key)));
    }
    await this.cache.del('photo-category:public');
    // Also invalidate photo caches since category changes affect photos
    await this.cache.del('photo:public');
  }
}
