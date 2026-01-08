import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackClickDto } from './dto';

export interface ClickStats {
  buttonName: string;
  totalClicks: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

@Injectable()
export class ClickTrackingService {
  private readonly logger = new Logger(ClickTrackingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackClick(dto: TrackClickDto, userAgent?: string, ipAddress?: string): Promise<void> {
    try {
      await this.prisma.clickTracking.create({
        data: {
          buttonName: dto.buttonName,
          pageUrl: dto.pageUrl,
          referrer: dto.referrer,
          userAgent,
          ipAddress,
        },
      });

      this.logger.log(`Tracked click: ${dto.buttonName} from ${ipAddress || 'unknown'}`);
    } catch (error) {
      this.logger.error(`Failed to track click: ${error.message}`);
      // Don't throw error - tracking should not break user experience
    }
  }

  async getClickStats(buttonName?: string): Promise<ClickStats[]> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const whereClause = buttonName ? { buttonName } : {};

    const [total, clicks24h, clicks7d, clicks30d] = await Promise.all([
      this.prisma.clickTracking.count({ where: whereClause }),
      this.prisma.clickTracking.count({
        where: { ...whereClause, createdAt: { gte: last24Hours } },
      }),
      this.prisma.clickTracking.count({
        where: { ...whereClause, createdAt: { gte: last7Days } },
      }),
      this.prisma.clickTracking.count({
        where: { ...whereClause, createdAt: { gte: last30Days } },
      }),
    ]);

    if (buttonName) {
      return [
        {
          buttonName,
          totalClicks: total,
          last24Hours: clicks24h,
          last7Days: clicks7d,
          last30Days: clicks30d,
        },
      ];
    }

    // Get stats for all buttons
    const allButtons = await this.prisma.clickTracking.groupBy({
      by: ['buttonName'],
      _count: true,
    });

    const stats = await Promise.all(
      allButtons.map(async button => {
        const [total, clicks24h, clicks7d, clicks30d] = await Promise.all([
          this.prisma.clickTracking.count({ where: { buttonName: button.buttonName } }),
          this.prisma.clickTracking.count({
            where: { buttonName: button.buttonName, createdAt: { gte: last24Hours } },
          }),
          this.prisma.clickTracking.count({
            where: { buttonName: button.buttonName, createdAt: { gte: last7Days } },
          }),
          this.prisma.clickTracking.count({
            where: { buttonName: button.buttonName, createdAt: { gte: last30Days } },
          }),
        ]);

        return {
          buttonName: button.buttonName,
          totalClicks: total,
          last24Hours: clicks24h,
          last7Days: clicks7d,
          last30Days: clicks30d,
        };
      }),
    );

    return stats;
  }

  async getClickHistory(
    buttonName?: string,
    days: number = 30,
  ): Promise<{ date: string; clicks: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause = buttonName
      ? { buttonName, createdAt: { gte: startDate } }
      : { createdAt: { gte: startDate } };

    const clicks = await this.prisma.clickTracking.findMany({
      where: whereClause,
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const clicksByDate = clicks.reduce(
      (acc, click) => {
        const date = click.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Fill in missing dates with 0
    const result: { date: string; clicks: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        clicks: clicksByDate[dateStr] || 0,
      });
    }

    return result;
  }
}
