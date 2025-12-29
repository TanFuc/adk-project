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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { MoHinhKinhDoanh } from "@prisma/client";
import { MoHinhKinhDoanhService } from "./mo-hinh-kinh-doanh.service";
import { CreateMoHinhKinhDoanhDto, UpdateMoHinhKinhDoanhDto, ReorderDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Mô Hình Kinh Doanh")
@Controller("mo-hinh-kinh-doanh")
@SkipThrottle()
export class MoHinhKinhDoanhController {
  constructor(private readonly moHinhKinhDoanhService: MoHinhKinhDoanhService) {}

  // Public endpoints
  @Get("public")
  @ApiOperation({ summary: "Lấy tất cả mô hình kinh doanh hiển thị (Public)" })
  @ApiResponse({ status: 200, description: "Danh sách mô hình kinh doanh" })
  async findAllPublic(): Promise<MoHinhKinhDoanh[]> {
    return this.moHinhKinhDoanhService.findAllPublic();
  }

  @Get("public/:id")
  @ApiOperation({ summary: "Xem chi tiết mô hình kinh doanh (Public)" })
  async findOnePublic(@Param("id", ParseUUIDPipe) id: string): Promise<MoHinhKinhDoanh> {
    return this.moHinhKinhDoanhService.findOnePublic(id);
  }

  // Admin endpoints
  @Get("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy tất cả mô hình kinh doanh (Admin)" })
  async findAll(): Promise<MoHinhKinhDoanh[]> {
    return this.moHinhKinhDoanhService.findAll();
  }

  @Get("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xem chi tiết mô hình kinh doanh (Admin)" })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<MoHinhKinhDoanh> {
    return this.moHinhKinhDoanhService.findOne(id);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tạo mô hình kinh doanh mới (Admin)" })
  async create(@Body() dto: CreateMoHinhKinhDoanhDto): Promise<MoHinhKinhDoanh> {
    return this.moHinhKinhDoanhService.create(dto);
  }

  @Patch("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cập nhật mô hình kinh doanh (Admin)" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateMoHinhKinhDoanhDto,
  ): Promise<MoHinhKinhDoanh> {
    return this.moHinhKinhDoanhService.update(id, dto);
  }

  @Patch("admin/:id/toggle")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Bật/tắt hiển thị mô hình kinh doanh (Admin)" })
  async toggleVisibility(@Param("id", ParseUUIDPipe) id: string): Promise<MoHinhKinhDoanh> {
    return this.moHinhKinhDoanhService.toggleVisibility(id);
  }

  @Patch("admin/reorder")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Sắp xếp lại thứ tự mô hình kinh doanh (Admin)" })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.moHinhKinhDoanhService.reorder(dto);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xóa mô hình kinh doanh (Admin)" })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.moHinhKinhDoanhService.delete(id);
  }
}
