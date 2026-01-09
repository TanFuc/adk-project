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
import { Photo } from '@prisma/client';
import { PhotoService } from './photo.service';
import { CreatePhotoDto, UpdatePhotoDto, ReorderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Photo')
@Controller('photo')
@SkipThrottle()
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible photos (Public)' })
  @ApiResponse({ status: 200, description: 'Photo list with categories' })
  async findAllPublic() {
    return this.photoService.findAllPublic();
  }

  @Get('public/category/:slug')
  @ApiOperation({ summary: 'Get photos by category slug (Public)' })
  async findByCategorySlug(@Param('slug') slug: string) {
    return this.photoService.findByCategorySlug(slug);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all photos (Admin)' })
  async findAll() {
    return this.photoService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get photo details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.photoService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new photo (Admin)' })
  async create(@Body() dto: CreatePhotoDto): Promise<Photo> {
    return this.photoService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update photo (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePhotoDto,
  ): Promise<Photo> {
    return this.photoService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete photo (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.photoService.delete(id);
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle photo visibility (Admin)' })
  async toggle(@Param('id', ParseUUIDPipe) id: string): Promise<Photo> {
    return this.photoService.toggle(id);
  }

  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder photos (Admin)' })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.photoService.reorder(dto);
  }
}
