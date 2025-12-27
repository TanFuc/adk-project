import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { LoaiNoiDung, NoiDung } from '@prisma/client';
import { NoiDungService } from './noi-dung.service';
import { CreateNoiDungDto, UpdateNoiDungDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Nội Dung')
@Controller('noi-dung')
@SkipThrottle()
export class NoiDungController {
  constructor(private readonly noiDungService: NoiDungService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Lấy tất cả nội dung hiển thị (Public)' })
  @ApiResponse({ status: 200, description: 'Danh sách nội dung theo loại' })
  async findPublic(): Promise<Record<string, NoiDung[]>> {
    return this.noiDungService.findPublic();
  }

  @Get('public/:loai')
  @ApiOperation({ summary: 'Lấy nội dung theo loại (Public)' })
  @ApiQuery({ name: 'loai', enum: LoaiNoiDung })
  async findByLoai(@Param('loai') loai: LoaiNoiDung): Promise<NoiDung[]> {
    return this.noiDungService.findByLoai(loai);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả nội dung (Admin)' })
  async findAll(): Promise<NoiDung[]> {
    return this.noiDungService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết nội dung (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NoiDung> {
    return this.noiDungService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo nội dung mới (Admin)' })
  async create(@Body() dto: CreateNoiDungDto): Promise<NoiDung> {
    return this.noiDungService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật nội dung (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNoiDungDto,
  ): Promise<NoiDung> {
    return this.noiDungService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa nội dung (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.noiDungService.delete(id);
  }

  @Post('admin/reorder/:loai')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sắp xếp lại thứ tự nội dung (Admin)' })
  async reorder(
    @Param('loai') loai: LoaiNoiDung,
    @Body() body: { ids: string[] },
  ): Promise<NoiDung[]> {
    return this.noiDungService.reorder(loai, body.ids);
  }
}
