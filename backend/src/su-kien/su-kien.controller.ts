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
import { SuKien } from "@prisma/client";
import { SuKienService } from "./su-kien.service";
import { CreateSuKienDto, UpdateSuKienDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Sự Kiện")
@Controller("su-kien")
@SkipThrottle()
export class SuKienController {
  constructor(private readonly suKienService: SuKienService) {}

  // Public endpoints
  @Get("public")
  @ApiOperation({ summary: "Lấy tất cả sự kiện hiển thị (Public)" })
  @ApiResponse({ status: 200, description: "Danh sách sự kiện" })
  async findAllPublic(): Promise<SuKien[]> {
    return this.suKienService.findAllPublic();
  }

  @Get("public/featured")
  @ApiOperation({ summary: "Lấy sự kiện nổi bật (Public)" })
  async findFeatured(): Promise<SuKien[]> {
    return this.suKienService.findFeatured();
  }

  @Get("public/upcoming")
  @ApiOperation({ summary: "Lấy sự kiện sắp diễn ra (Public)" })
  async findUpcoming(): Promise<SuKien[]> {
    return this.suKienService.findUpcoming();
  }

  @Get("public/past")
  @ApiOperation({ summary: "Lấy sự kiện đã qua (Public)" })
  async findPast(): Promise<SuKien[]> {
    return this.suKienService.findPast();
  }

  @Get("public/:id")
  @ApiOperation({ summary: "Xem chi tiết sự kiện (Public)" })
  async findOnePublic(@Param("id", ParseUUIDPipe) id: string): Promise<SuKien> {
    return this.suKienService.findOnePublic(id);
  }

  // Admin endpoints
  @Get("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy tất cả sự kiện (Admin)" })
  async findAll(): Promise<SuKien[]> {
    return this.suKienService.findAll();
  }

  @Get("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xem chi tiết sự kiện (Admin)" })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<SuKien> {
    return this.suKienService.findOne(id);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tạo sự kiện mới (Admin)" })
  async create(@Body() dto: CreateSuKienDto): Promise<SuKien> {
    return this.suKienService.create(dto);
  }

  @Patch("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cập nhật sự kiện (Admin)" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateSuKienDto,
  ): Promise<SuKien> {
    return this.suKienService.update(id, dto);
  }

  @Patch("admin/:id/toggle-featured")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Bật/tắt sự kiện nổi bật (Admin)" })
  async toggleFeatured(@Param("id", ParseUUIDPipe) id: string): Promise<SuKien> {
    return this.suKienService.toggleFeatured(id);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xóa sự kiện (Admin)" })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.suKienService.delete(id);
  }
}
