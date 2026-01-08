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
import { Section, LayoutType } from '@prisma/client';
import { SectionService } from './section.service';
import { CreateSectionDto, UpdateSectionDto, ReorderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Section')
@Controller('section')
@SkipThrottle()
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible sections (Public)' })
  @ApiResponse({ status: 200, description: 'Section list' })
  async findAllPublic(): Promise<Section[]> {
    return this.sectionService.findAllPublic();
  }

  @Get('public/key/:key')
  @ApiOperation({ summary: 'Get section by key (Public)' })
  async findByKey(@Param('key') key: string): Promise<Section | null> {
    return this.sectionService.findByKey(key);
  }

  @Get('public/layout/:layoutType')
  @ApiOperation({ summary: 'Get sections by layout type (Public)' })
  async findByLayoutType(@Param('layoutType') layoutType: LayoutType): Promise<Section[]> {
    return this.sectionService.findByLayoutType(layoutType);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sections (Admin)' })
  async findAll(): Promise<Section[]> {
    return this.sectionService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get section details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Section> {
    return this.sectionService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new section (Admin)' })
  async create(@Body() dto: CreateSectionDto): Promise<Section> {
    return this.sectionService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update section (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSectionDto,
  ): Promise<Section> {
    return this.sectionService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete section (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.sectionService.delete(id);
  }

  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder sections (Admin)' })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.sectionService.reorder(dto);
  }
}
