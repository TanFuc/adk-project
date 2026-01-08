import { Injectable, NotFoundException, ConflictException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Section, LayoutType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto, ReorderDto } from './dto';

@Injectable()
export class SectionService {
  private readonly logger = new Logger(SectionService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findByKey(key: string): Promise<Section | null> {
    const cacheKey = `section:key:${key}`;
    const cached = await this.cache.get<Section>(cacheKey);

    if (cached) {
      return cached;
    }

    const section = await this.prisma.section.findUnique({
      where: { key, isVisible: true },
    });

    if (section) {
      await this.cache.set(cacheKey, section, 300000);
    }

    return section;
  }

  async findByLayoutType(layoutType: LayoutType): Promise<Section[]> {
    const cacheKey = `section:layout:${layoutType}`;
    const cached = await this.cache.get<Section[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const sections = await this.prisma.section.findMany({
      where: { layoutType, isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    await this.cache.set(cacheKey, sections, 300000);

    return sections;
  }

  async findAllPublic(): Promise<Section[]> {
    const cacheKey = 'section:public';
    const cached = await this.cache.get<Section[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const sections = await this.prisma.section.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    await this.cache.set(cacheKey, sections, 300000);

    return sections;
  }

  async findAll(): Promise<Section[]> {
    return this.prisma.section.findMany({
      orderBy: [{ layoutType: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found with this ID.');
    }

    return section;
  }

  async create(dto: CreateSectionDto): Promise<Section> {
    const existing = await this.prisma.section.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Key "${dto.key}" already exists.`);
    }

    const section = await this.prisma.section.create({
      data: {
        key: dto.key,
        layoutType: dto.layoutType,
        content: dto.content as Prisma.InputJsonValue,
        images: dto.images ?? [],
        ctaLink: dto.ctaLink,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new section: ${section.id} - ${dto.key}`);

    return section;
  }

  async update(id: string, dto: UpdateSectionDto): Promise<Section> {
    const existing = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Section not found with this ID.');
    }

    const section = await this.prisma.section.update({
      where: { id },
      data: {
        layoutType: dto.layoutType,
        content: dto.content ? (dto.content as Prisma.InputJsonValue) : undefined,
        images: dto.images,
        ctaLink: dto.ctaLink,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Updated section: ${id}`);

    return section;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Section not found with this ID.');
    }

    await this.prisma.section.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted section: ${id}`);
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.section.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Reordered ${dto.items.length} sections`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.('section:*');
    if (keys && keys.length > 0) {
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
    await this.cache.del('section:public');
  }
}
