import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Event, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findFeatured(): Promise<Event[]> {
    const cacheKey = 'event:featured';
    const cached = await this.cache.get<Event[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const events = await this.prisma.event.findMany({
      where: { isFeatured: true, isVisible: true },
      orderBy: { startDate: 'desc' },
      take: 5,
    });

    await this.cache.set(cacheKey, events, 300000);

    return events;
  }

  async findUpcoming(): Promise<Event[]> {
    const cacheKey = 'event:upcoming';
    const cached = await this.cache.get<Event[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        isVisible: true,
        startDate: { gte: now },
      },
      orderBy: { startDate: 'asc' },
    });

    await this.cache.set(cacheKey, events, 300000);

    return events;
  }

  async findPast(): Promise<Event[]> {
    const cacheKey = 'event:past';
    const cached = await this.cache.get<Event[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        isVisible: true,
        OR: [{ endDate: { lt: now } }, { endDate: null, startDate: { lt: now } }],
      },
      orderBy: { startDate: 'desc' },
    });

    await this.cache.set(cacheKey, events, 300000);

    return events;
  }

  async findAllPublic(): Promise<Event[]> {
    const cacheKey = 'event:public';
    const cached = await this.cache.get<Event[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const events = await this.prisma.event.findMany({
      where: { isVisible: true },
      orderBy: { startDate: 'desc' },
    });

    await this.cache.set(cacheKey, events, 300000);

    return events;
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found with this ID.');
    }

    return event;
  }

  async findOnePublic(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id, isVisible: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found with this ID.');
    }

    return event;
  }

  async create(dto: CreateEventDto): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        coverImage: dto.coverImage,
        gallery: dto.gallery ?? [],
        content: (dto.content ?? {}) as Prisma.InputJsonValue,
        isFeatured: dto.isFeatured ?? false,
        isVisible: dto.isVisible ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new event: ${event.id} - ${dto.title}`);

    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const existing = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Event not found with this ID.');
    }

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.endDate !== undefined) {
      updateData.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    const event = await this.prisma.event.update({
      where: { id },
      data: updateData,
    });

    await this.invalidateCaches();

    this.logger.log(`Updated event: ${id}`);

    return event;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Event not found with this ID.');
    }

    await this.prisma.event.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted event: ${id}`);
  }

  async toggleFeatured(id: string): Promise<Event> {
    const existing = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Event not found with this ID.');
    }

    const event = await this.prisma.event.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle featured event: ${id} -> ${event.isFeatured}`);

    return event;
  }

  private async invalidateCaches(): Promise<void> {
    await Promise.all([
      this.cache.del('event:featured'),
      this.cache.del('event:upcoming'),
      this.cache.del('event:past'),
      this.cache.del('event:public'),
    ]);
  }
}
