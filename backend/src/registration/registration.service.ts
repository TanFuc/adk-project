import { Injectable, ConflictException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { RegistrationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRegistrationDto,
  RegistrationResponseDto,
  RegistrationDetailDto,
  RegistrationStatsDto,
} from './dto';
import { encrypt, decrypt, hashForSearch } from '../common/utils/encryption.util';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateRegistrationDto): Promise<RegistrationResponseDto> {
    // 1. Check cache for duplicate (24h)
    const phoneHash = hashForSearch(dto.phone);
    const cacheKey = `registration:${phoneHash}`;
    const cached = await this.cache.get<string>(cacheKey);

    if (cached) {
      this.logger.warn(`Duplicate registration (cache): ${dto.phone.slice(0, 4)}****`);
      throw new ConflictException(
        'You have registered recently. Please wait 24 hours to register again.',
      );
    }

    // 2. Check DB duplicate (24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get all registrations in last 24h and check phone hash
    const recentRegistrations = await this.prisma.registration.findMany({
      where: {
        createdAt: { gte: twentyFourHoursAgo },
      },
      select: { phone: true },
    });

    const isDuplicate = recentRegistrations.some(reg => {
      try {
        const decryptedPhone = decrypt(reg.phone);
        return decryptedPhone === dto.phone;
      } catch {
        return false;
      }
    });

    if (isDuplicate) {
      this.logger.warn(`Duplicate registration (DB): ${dto.phone.slice(0, 4)}****`);
      throw new ConflictException(
        'This phone number has registered in the last 24 hours. Please try again later.',
      );
    }

    // 3. Encrypt phone number
    const encryptedPhone = encrypt(dto.phone);

    // 4. Create registration
    const registration = await this.prisma.registration.create({
      data: {
        fullName: dto.fullName,
        phone: encryptedPhone,
        province: dto.province,
        district: dto.district,
        address: dto.address,
        status: RegistrationStatus.PENDING,
        source: 'landing_page',
      },
      select: { id: true, fullName: true },
    });

    // 5. Cache for 24h (86400000ms)
    await this.cache.set(cacheKey, registration.id, 86400000);

    // 6. Invalidate stats cache
    await this.cache.del('registration:stats');

    // 7. Get redirect URL from config
    const redirectUrl = this.config.get<string>('REDIRECT_URL') || undefined;

    this.logger.log(`New registration success: ${registration.id}`);

    return {
      id: registration.id,
      message: `Thank you ${registration.fullName}! Registration successful. We will contact you shortly.`,
      redirectUrl,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: RegistrationStatus,
  ): Promise<{ data: RegistrationDetailDto[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [registrations, total] = await Promise.all([
      this.prisma.registration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.registration.count({ where }),
    ]);

    const data: RegistrationDetailDto[] = registrations.map(reg => ({
      ...reg,
      phone: this.maskPhone(decrypt(reg.phone)),
      address: reg.address ?? undefined,
    }));

    return {
      data,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<RegistrationDetailDto> {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found with this ID.');
    }

    return {
      ...registration,
      phone: decrypt(registration.phone),
      address: registration.address ?? undefined,
    };
  }

  async updateStatus(id: string, status: RegistrationStatus): Promise<RegistrationDetailDto> {
    const existing = await this.prisma.registration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Registration not found with this ID.');
    }

    const updated = await this.prisma.registration.update({
      where: { id },
      data: { status },
    });

    // Invalidate stats cache
    await this.cache.del('registration:stats');

    this.logger.log(`Updated registration status ${id}: ${status}`);

    return {
      ...updated,
      phone: this.maskPhone(decrypt(updated.phone)),
      address: updated.address ?? undefined,
    };
  }

  async getStats(): Promise<RegistrationStatsDto> {
    const cacheKey = 'registration:stats';
    const cached = await this.cache.get<RegistrationStatsDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const [total, pending, contacted, success, rejected] = await Promise.all([
      this.prisma.registration.count(),
      this.prisma.registration.count({ where: { status: RegistrationStatus.PENDING } }),
      this.prisma.registration.count({ where: { status: RegistrationStatus.CONTACTED } }),
      this.prisma.registration.count({ where: { status: RegistrationStatus.SUCCESS } }),
      this.prisma.registration.count({ where: { status: RegistrationStatus.REJECTED } }),
    ]);

    const stats: RegistrationStatsDto = {
      total,
      pending,
      contacted,
      success,
      rejected,
    };

    // Cache for 5 minutes
    await this.cache.set(cacheKey, stats, 300000);

    return stats;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.registration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Registration not found with this ID.');
    }

    await this.prisma.registration.delete({ where: { id } });

    // Invalidate stats cache
    await this.cache.del('registration:stats');

    this.logger.log(`Deleted registration: ${id}`);
  }

  private maskPhone(phone: string): string {
    if (phone.length < 6) {
      return phone;
    }
    return phone.slice(0, 4) + '****' + phone.slice(-2);
  }
}
