import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Photo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoDto, UpdatePhotoDto, ReorderDto } from './dto';

type PhotoWithCategory = Photo & {
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

@Injectable()
export class PhotoService {
  private readonly logger = new Logger(PhotoService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAllPublic(): Promise<PhotoWithCategory[]> {
    const cacheKey = 'photo:public';
    const cached = await this.cache.get<PhotoWithCategory[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const photos = await this.prisma.photo.findMany({
      where: {
        isVisible: true,
        category: { isVisible: true },
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    await this.cache.set(cacheKey, photos, 300000);

    return photos;
  }

  async findByCategorySlug(slug: string): Promise<PhotoWithCategory[]> {
    const cacheKey = `photo:category:${slug}`;
    const cached = await this.cache.get<PhotoWithCategory[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const photos = await this.prisma.photo.findMany({
      where: {
        isVisible: true,
        category: {
          slug,
          isVisible: true,
        },
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    await this.cache.set(cacheKey, photos, 300000);

    return photos;
  }

  async findAll(): Promise<PhotoWithCategory[]> {
    return this.prisma.photo.findMany({
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<PhotoWithCategory> {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found with this ID.');
    }

    return photo;
  }

  async create(dto: CreatePhotoDto): Promise<Photo> {
    // Verify category exists
    const category = await this.prisma.photoCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found with this ID.');
    }

    const photo = await this.prisma.photo.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new photo: ${photo.id} - ${dto.title}`);

    return photo;
  }

  async update(id: string, dto: UpdatePhotoDto): Promise<Photo> {
    const existing = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Photo not found with this ID.');
    }

    if (dto.categoryId) {
      const category = await this.prisma.photoCategory.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found with this ID.');
      }
    }

    const photo = await this.prisma.photo.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Updated photo: ${id}`);

    return photo;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Photo not found with this ID.');
    }

    await this.prisma.photo.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted photo: ${id}`);
  }

  async toggle(id: string): Promise<Photo> {
    const existing = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Photo not found with this ID.');
    }

    const photo = await this.prisma.photo.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggled photo visibility: ${id} -> ${photo.isVisible}`);

    return photo;
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map(item =>
        this.prisma.photo.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Reordered ${dto.items.length} photos`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.('photo:*');
    if (keys && keys.length > 0) {
      await Promise.all(keys.map(key => this.cache.del(key)));
    }
    await this.cache.del('photo:public');
  }
}
