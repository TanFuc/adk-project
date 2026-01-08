import { Injectable, NotFoundException, ConflictException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Configuration, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConfigurationDto, UpdateConfigurationDto } from './dto';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(): Promise<Configuration[]> {
    const cacheKey = 'configuration:all';
    const cached = await this.cache.get<Configuration[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const configurations = await this.prisma.configuration.findMany();

    // Cache for 10 minutes
    await this.cache.set(cacheKey, configurations, 600000);

    return configurations;
  }

  async findByKey(key: string): Promise<Configuration> {
    const cacheKey = `configuration:${key}`;
    const cached = await this.cache.get<Configuration>(cacheKey);

    if (cached) {
      return cached;
    }

    const configuration = await this.prisma.configuration.findUnique({
      where: { key },
    });

    if (!configuration) {
      throw new NotFoundException(`Configuration not found with key: ${key}`);
    }

    // Cache for 10 minutes
    await this.cache.set(cacheKey, configuration, 600000);

    return configuration;
  }

  async findPublic(): Promise<Record<string, unknown>> {
    const cacheKey = 'configuration:public';
    const cached = await this.cache.get<Record<string, unknown>>(cacheKey);

    if (cached) {
      return cached;
    }

    const allConfig = await this.prisma.configuration.findMany();

    // Convert to key-value object
    const configMap: Record<string, unknown> = {};
    for (const config of allConfig) {
      configMap[config.key] = config.value;
    }

    // Cache for 10 minutes
    await this.cache.set(cacheKey, configMap, 600000);

    return configMap;
  }

  async create(dto: CreateConfigurationDto): Promise<Configuration> {
    // Check if key already exists
    const existing = await this.prisma.configuration.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Key "${dto.key}" already exists.`);
    }

    const configuration = await this.prisma.configuration.create({
      data: {
        key: dto.key,
        value: dto.value as Prisma.InputJsonValue,
        description: dto.description,
      },
    });

    // Invalidate caches
    await this.invalidateCaches(dto.key);

    this.logger.log(`Created new configuration: ${dto.key}`);

    return configuration;
  }

  async update(key: string, dto: UpdateConfigurationDto): Promise<Configuration> {
    const existing = await this.prisma.configuration.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Configuration not found with key: ${key}`);
    }

    const configuration = await this.prisma.configuration.update({
      where: { key },
      data: {
        value: dto.value ? (dto.value as Prisma.InputJsonValue) : undefined,
        description: dto.description,
      },
    });

    // Invalidate caches
    await this.invalidateCaches(key);

    this.logger.log(`Updated configuration: ${key}`);

    return configuration;
  }

  async delete(key: string): Promise<void> {
    const existing = await this.prisma.configuration.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Configuration not found with key: ${key}`);
    }

    await this.prisma.configuration.delete({ where: { key } });

    // Invalidate caches
    await this.invalidateCaches(key);

    this.logger.log(`Deleted configuration: ${key}`);
  }

  private async invalidateCaches(key: string): Promise<void> {
    await Promise.all([
      this.cache.del(`configuration:${key}`),
      this.cache.del('configuration:all'),
      this.cache.del('configuration:public'),
    ]);
  }
}
