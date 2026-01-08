import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { ClickTrackingService, ClickStats } from './click-tracking.service';
import { TrackClickDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Click Tracking')
@Controller('click-tracking')
export class ClickTrackingController {
  constructor(private readonly clickTrackingService: ClickTrackingService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Max 10 clicks per minute per IP
  @ApiOperation({ summary: 'Track button click (Public)' })
  @ApiResponse({ status: 201, description: 'Click tracked successfully' })
  async trackClick(@Body() dto: TrackClickDto, @Req() req: Request): Promise<{ success: boolean }> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip;

    await this.clickTrackingService.trackClick(dto, userAgent, ipAddress);

    return { success: true };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @SkipThrottle()
  @ApiOperation({ summary: 'Get click statistics (Admin)' })
  @ApiQuery({ name: 'buttonName', required: false, description: 'Filter by button name' })
  @ApiResponse({ status: 200, description: 'Click statistics' })
  async getStats(@Query('buttonName') buttonName?: string): Promise<ClickStats[]> {
    return this.clickTrackingService.getClickStats(buttonName);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @SkipThrottle()
  @ApiOperation({ summary: 'Get click history (Admin)' })
  @ApiQuery({ name: 'buttonName', required: false, description: 'Filter by button name' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days', type: Number })
  @ApiResponse({ status: 200, description: 'Click history by date' })
  async getHistory(
    @Query('buttonName') buttonName?: string,
    @Query('days') days?: string,
  ): Promise<{ date: string; clicks: number }[]> {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.clickTrackingService.getClickHistory(buttonName, daysNum);
  }
}
