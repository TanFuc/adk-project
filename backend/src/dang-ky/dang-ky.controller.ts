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
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { TrangThai } from '@prisma/client';
import { DangKyService } from './dang-ky.service';
import {
  CreateDangKyDto,
  DangKyResponseDto,
  DangKyDetailDto,
  UpdateTrangThaiDto,
  DangKyStatsDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Đăng Ký')
@Controller('dang-ky')
export class DangKyController {
  constructor(private readonly dangKyService: DangKyService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for registration
  @ApiOperation({ summary: 'Tạo đăng ký mới từ landing page' })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    type: DangKyResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Đã đăng ký trong 24h qua' })
  @ApiResponse({ status: 429, description: 'Quá nhiều yêu cầu' })
  async create(@Body() dto: CreateDangKyDto): Promise<DangKyResponseDto> {
    return this.dangKyService.create(dto);
  }

  // Admin endpoints
  @Get('admin')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách đăng ký (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'trangThai', required: false, enum: TrangThai })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('trangThai') trangThai?: TrangThai,
  ): Promise<{ data: DangKyDetailDto[]; total: number; pages: number }> {
    return this.dangKyService.findAll(page, limit, trangThai);
  }

  @Get('admin/stats')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thống kê đăng ký (Admin)' })
  async getStats(): Promise<DangKyStatsDto> {
    return this.dangKyService.getStats();
  }

  @Get('admin/:id')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết đăng ký (Admin)' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DangKyDetailDto> {
    return this.dangKyService.findOne(id);
  }

  @Patch('admin/:id/trang-thai')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái đăng ký (Admin)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTrangThaiDto,
  ): Promise<DangKyDetailDto> {
    return this.dangKyService.updateStatus(id, dto.trangThai);
  }

  @Delete('admin/:id')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa đăng ký (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.dangKyService.delete(id);
  }
}
