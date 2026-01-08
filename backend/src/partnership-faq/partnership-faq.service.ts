import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PartnershipFaq } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnershipFaqDto, UpdatePartnershipFaqDto, ReorderDto } from './dto';

@Injectable()
export class PartnershipFaqService {
  private readonly logger = new Logger(PartnershipFaqService.name);
  private readonly CACHE_KEY = 'partnership-faq';
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAllPublic(): Promise<PartnershipFaq[]> {
    const cacheKey = `${this.CACHE_KEY}:public`;
    const cached = await this.cache.get<PartnershipFaq[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.prisma.partnershipFaq.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    await this.cache.set(cacheKey, data, this.CACHE_TTL);

    return data;
  }

  async findAll(): Promise<PartnershipFaq[]> {
    return this.prisma.partnershipFaq.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string): Promise<PartnershipFaq> {
    const data = await this.prisma.partnershipFaq.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException('FAQ not found with this ID.');
    }

    return data;
  }

  async create(dto: CreatePartnershipFaqDto): Promise<PartnershipFaq> {
    const data = await this.prisma.partnershipFaq.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        sortOrder: dto.sortOrder ?? 0,
        isVisible: dto.isVisible ?? true,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Created new FAQ: ${data.id}`);

    return data;
  }

  async update(id: string, dto: UpdatePartnershipFaqDto): Promise<PartnershipFaq> {
    const existing = await this.prisma.partnershipFaq.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ not found with this ID.');
    }

    const data = await this.prisma.partnershipFaq.update({
      where: { id },
      data: {
        question: dto.question,
        answer: dto.answer,
        sortOrder: dto.sortOrder,
        isVisible: dto.isVisible,
      },
    });

    await this.invalidateCaches();

    this.logger.log(`Updated FAQ: ${id}`);

    return data;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.partnershipFaq.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ not found with this ID.');
    }

    await this.prisma.partnershipFaq.delete({ where: { id } });

    await this.invalidateCaches();

    this.logger.log(`Deleted FAQ: ${id}`);
  }

  async toggleVisibility(id: string): Promise<PartnershipFaq> {
    const existing = await this.prisma.partnershipFaq.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('FAQ not found with this ID.');
    }

    const data = await this.prisma.partnershipFaq.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
    });

    await this.invalidateCaches();

    this.logger.log(`Toggle FAQ visibility: ${id} -> ${data.isVisible}`);

    return data;
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.partnershipFaq.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    await this.invalidateCaches();

    this.logger.log(`Reordered ${dto.items.length} FAQs`);
  }

  private async invalidateCaches(): Promise<void> {
    const keys = await this.cache.store.keys?.(`${this.CACHE_KEY}:*`);
    if (keys && keys.length > 0) {
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
    await this.cache.del(`${this.CACHE_KEY}:public`);
  }
}
