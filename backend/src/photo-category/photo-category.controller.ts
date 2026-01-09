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
import { PhotoCategory } from '@prisma/client';
import { PhotoCategoryService } from './photo-category.service';
import { CreatePhotoCategoryDto, UpdatePhotoCategoryDto, ReorderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('PhotoCategory')
@Controller('photo-category')
@SkipThrottle()
export class PhotoCategoryController {
  constructor(private readonly photoCategoryService: PhotoCategoryService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible photo categories (Public)' })
  @ApiResponse({ status: 200, description: 'Category list with photo count' })
  async findAllPublic(): Promise<(PhotoCategory & { photoCount: number })[]> {
    return this.photoCategoryService.findAllPublic();
  }

  @Get('public/slug/:slug')
  @ApiOperation({ summary: 'Get photo category by slug (Public)' })
  async findBySlug(@Param('slug') slug: string): Promise<PhotoCategory | null> {
    return this.photoCategoryService.findBySlug(slug);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all photo categories (Admin)' })
  async findAll(): Promise<PhotoCategory[]> {
    return this.photoCategoryService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get photo category details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PhotoCategory> {
    return this.photoCategoryService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new photo category (Admin)' })
  async create(@Body() dto: CreatePhotoCategoryDto): Promise<PhotoCategory> {
    return this.photoCategoryService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update photo category (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePhotoCategoryDto,
  ): Promise<PhotoCategory> {
    return this.photoCategoryService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete photo category (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.photoCategoryService.delete(id);
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle photo category visibility (Admin)' })
  async toggle(@Param('id', ParseUUIDPipe) id: string): Promise<PhotoCategory> {
    return this.photoCategoryService.toggle(id);
  }

  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder photo categories (Admin)' })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.photoCategoryService.reorder(dto);
  }
}
