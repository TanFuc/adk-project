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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { ContentType, Content } from '@prisma/client';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Content')
@Controller('content')
@SkipThrottle()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible content (Public)' })
  @ApiResponse({ status: 200, description: 'Content list by type' })
  async findPublic(): Promise<Record<string, Content[]>> {
    return this.contentService.findPublic();
  }

  @Get('public/:type')
  @ApiOperation({ summary: 'Get content by type (Public)' })
  @ApiQuery({ name: 'type', enum: ContentType })
  async findByType(@Param('type') type: ContentType): Promise<Content[]> {
    return this.contentService.findByType(type);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content (Admin)' })
  async findAll(): Promise<Content[]> {
    return this.contentService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Content> {
    return this.contentService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new content (Admin)' })
  async create(@Body() dto: CreateContentDto): Promise<Content> {
    return this.contentService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContentDto,
  ): Promise<Content> {
    return this.contentService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.contentService.delete(id);
  }

  @Post('admin/reorder/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder content (Admin)' })
  async reorder(
    @Param('type') type: ContentType,
    @Body() body: { ids: string[] },
  ): Promise<Content[]> {
    return this.contentService.reorder(type, body.ids);
  }
}
