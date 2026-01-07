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
import { HoiDapHopTac } from "@prisma/client";
import { HoiDapHopTacService } from "./hoi-dap-hop-tac.service";
import { CreateHoiDapHopTacDto, UpdateHoiDapHopTacDto, ReorderDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Hỏi Đáp Hợp Tác")
@Controller("hoi-dap-hop-tac")
@SkipThrottle()
export class HoiDapHopTacController {
  constructor(private readonly hoiDapHopTacService: HoiDapHopTacService) {}

  // Public endpoints
  @Get("public")
  @ApiOperation({ summary: "Lấy tất cả hỏi đáp hiển thị (Public)" })
  @ApiResponse({ status: 200, description: "Danh sách hỏi đáp" })
  async findAllPublic(): Promise<HoiDapHopTac[]> {
    return this.hoiDapHopTacService.findAllPublic();
  }

  // Admin endpoints
  @Get("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy tất cả hỏi đáp (Admin)" })
  async findAll(): Promise<HoiDapHopTac[]> {
    return this.hoiDapHopTacService.findAll();
  }

  @Get("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xem chi tiết hỏi đáp (Admin)" })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<HoiDapHopTac> {
    return this.hoiDapHopTacService.findOne(id);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tạo hỏi đáp mới (Admin)" })
  async create(@Body() dto: CreateHoiDapHopTacDto): Promise<HoiDapHopTac> {
    return this.hoiDapHopTacService.create(dto);
  }

  @Patch("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cập nhật hỏi đáp (Admin)" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateHoiDapHopTacDto,
  ): Promise<HoiDapHopTac> {
    return this.hoiDapHopTacService.update(id, dto);
  }

  @Patch("admin/:id/toggle")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Bật/tắt hiển thị hỏi đáp (Admin)" })
  async toggleVisibility(@Param("id", ParseUUIDPipe) id: string): Promise<HoiDapHopTac> {
    return this.hoiDapHopTacService.toggleVisibility(id);
  }

  @Patch("admin/reorder")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Sắp xếp lại thứ tự hỏi đáp (Admin)" })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.hoiDapHopTacService.reorder(dto);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xóa hỏi đáp (Admin)" })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.hoiDapHopTacService.delete(id);
  }
}
