import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ContentType, Content, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto, UpdateContentDto } from './dto';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findByType(type: ContentType): Promise<Content[]> {
    const cacheKey = `content:${type}`;
    const cached = await this.cache.get<Content[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const content = await this.prisma.content.findMany({
      where: { type, isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    // Cache for 5 minutes
    await this.cache.set(cacheKey, content, 300000);

    return content;
  }

  async findAll(): Promise<Content[]> {
    const cacheKey = 'content:all';
    const cached = await this.cache.get<Content[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const content = await this.prisma.content.findMany({
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
    });

    // Cache for 5 minutes
    await this.cache.set(cacheKey, content, 300000);

    return content;
  }

  async findPublic(): Promise<Record<string, Content[]>> {
    const cacheKey = 'content:public';
    const cached = await this.cache.get<Record<string, Content[]>>(cacheKey);

    if (cached) {
      return cached;
    }

    const allContent = await this.prisma.content.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    // Group by type
    const grouped: Record<string, Content[]> = {};
    for (const item of allContent) {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    }

    // Cache for 5 minutes
    await this.cache.set(cacheKey, grouped, 300000);

    return grouped;
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.prisma.content.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Content not found with this ID.');
    }

    return content;
  }

  async create(dto: CreateContentDto): Promise<Content> {
    const content = await this.prisma.content.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        content: dto.content as Prisma.InputJsonValue,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
      },
    });

    // Invalidate caches
    await this.invalidateCaches(dto.type);

    this.logger.log(`Created new content: ${content.id} - ${dto.type}`);

    return content;
  }

  async update(id: string, dto: UpdateContentDto): Promise<Content> {
    const existing = await this.prisma.content.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Content not found with this ID.');
    }

    const content = await this.prisma.content.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content ? (dto.content as Prisma.InputJsonValue) : undefined,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
      },
    });

    // Invalidate caches
    await this.invalidateCaches(existing.type);

    this.logger.log(`Updated content: ${id}`);

    return content;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.content.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Content not found with this ID.');
    }

    await this.prisma.content.delete({ where: { id } });

    // Invalidate caches
    await this.invalidateCaches(existing.type);

    this.logger.log(`Deleted content: ${id}`);
  }

  async reorder(type: ContentType, ids: string[]): Promise<Content[]> {
    // Update order for each item
    const updates = ids.map((id, index) =>
      this.prisma.content.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );

    const updated = await this.prisma.$transaction(updates);

    // Invalidate caches
    await this.invalidateCaches(type);

    this.logger.log(`Reordered content: ${type}`);

    return updated;
  }

  private async invalidateCaches(type: ContentType): Promise<void> {
    await Promise.all([
      this.cache.del(`content:${type}`),
      this.cache.del('content:all'),
      this.cache.del('content:public'),
    ]);
  }
}
