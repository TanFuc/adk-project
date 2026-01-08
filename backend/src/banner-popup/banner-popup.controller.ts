import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { BannerPopup } from '@prisma/client';
import { BannerPopupService } from './banner-popup.service';
import { CreateBannerPopupDto, UpdateBannerPopupDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Banner Popup')
@Controller('banner-popup')
@SkipThrottle()
export class BannerPopupController {
  constructor(private readonly bannerPopupService: BannerPopupService) {}

  // Public endpoints
  @Get('public/active')
  @ApiOperation({ summary: 'Get active banner popup (Public)' })
  @ApiResponse({ status: 200, description: 'Highest priority banner popup' })
  async findActivePopup(): Promise<BannerPopup | null> {
    return this.bannerPopupService.findActivePopup();
  }

  @Get('public/all-active')
  @ApiOperation({ summary: 'Get all active banner popups (Public)' })
  async findAllActive(): Promise<BannerPopup[]> {
    return this.bannerPopupService.findAllActive();
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all banner popups (Admin)' })
  async findAll(): Promise<BannerPopup[]> {
    return this.bannerPopupService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get banner popup details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BannerPopup> {
    return this.bannerPopupService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new banner popup (Admin)' })
  async create(@Body() dto: CreateBannerPopupDto): Promise<BannerPopup> {
    return this.bannerPopupService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner popup (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBannerPopupDto,
  ): Promise<BannerPopup> {
    return this.bannerPopupService.update(id, dto);
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle banner popup active status (Admin)' })
  async toggleActive(@Param('id', ParseUUIDPipe) id: string): Promise<BannerPopup> {
    return this.bannerPopupService.toggleActive(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete banner popup (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.bannerPopupService.delete(id);
  }
}
