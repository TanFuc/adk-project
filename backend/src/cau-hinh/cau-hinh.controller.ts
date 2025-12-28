import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { CauHinh } from "@prisma/client";
import { CauHinhService } from "./cau-hinh.service";
import { CreateCauHinhDto, UpdateCauHinhDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Cấu Hình")
@Controller("cau-hinh")
@SkipThrottle()
export class CauHinhController {
  constructor(private readonly cauHinhService: CauHinhService) {}

  // Public endpoint
  @Get("public")
  @ApiOperation({ summary: "Lấy tất cả cấu hình (Public)" })
  @ApiResponse({ status: 200, description: "Danh sách cấu hình" })
  async findPublic(): Promise<Record<string, unknown>> {
    return this.cauHinhService.findPublic();
  }

  // Admin endpoints
  @Get("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy tất cả cấu hình (Admin)" })
  async findAll(): Promise<CauHinh[]> {
    return this.cauHinhService.findAll();
  }

  @Get("admin/:key")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xem chi tiết cấu hình theo key (Admin)" })
  async findByKey(@Param("key") key: string): Promise<CauHinh> {
    return this.cauHinhService.findByKey(key);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tạo cấu hình mới (Admin)" })
  async create(@Body() dto: CreateCauHinhDto): Promise<CauHinh> {
    return this.cauHinhService.create(dto);
  }

  @Patch("admin/:key")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cập nhật cấu hình (Admin)" })
  async update(@Param("key") key: string, @Body() dto: UpdateCauHinhDto): Promise<CauHinh> {
    return this.cauHinhService.update(key, dto);
  }

  @Delete("admin/:key")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xóa cấu hình (Admin)" })
  async delete(@Param("key") key: string): Promise<void> {
    return this.cauHinhService.delete(key);
  }
}
