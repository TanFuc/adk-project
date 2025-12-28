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
import { PhanMuc, LoaiBoCuc } from "@prisma/client";
import { PhanMucService } from "./phan-muc.service";
import { CreatePhanMucDto, UpdatePhanMucDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Phần Mục Trang")
@Controller("phan-muc")
@SkipThrottle()
export class PhanMucController {
  constructor(private readonly phanMucService: PhanMucService) {}

  // Public endpoints
  @Get("public")
  @ApiOperation({ summary: "Lấy tất cả phần mục hiển thị (Public)" })
  @ApiResponse({ status: 200, description: "Danh sách phần mục" })
  async findAllPublic(): Promise<PhanMuc[]> {
    return this.phanMucService.findAllPublic();
  }

  @Get("public/key/:key")
  @ApiOperation({ summary: "Lấy phần mục theo key (Public)" })
  async findByKey(@Param("key") key: string): Promise<PhanMuc | null> {
    return this.phanMucService.findByKey(key);
  }

  @Get("public/loai/:loaiBoCuc")
  @ApiOperation({ summary: "Lấy phần mục theo loại bố cục (Public)" })
  async findByLoaiBoCuc(@Param("loaiBoCuc") loaiBoCuc: LoaiBoCuc): Promise<PhanMuc[]> {
    return this.phanMucService.findByLoaiBoCuc(loaiBoCuc);
  }

  // Admin endpoints
  @Get("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy tất cả phần mục (Admin)" })
  async findAll(): Promise<PhanMuc[]> {
    return this.phanMucService.findAll();
  }

  @Get("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xem chi tiết phần mục (Admin)" })
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<PhanMuc> {
    return this.phanMucService.findOne(id);
  }

  @Post("admin")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tạo phần mục mới (Admin)" })
  async create(@Body() dto: CreatePhanMucDto): Promise<PhanMuc> {
    return this.phanMucService.create(dto);
  }

  @Patch("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cập nhật phần mục (Admin)" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdatePhanMucDto,
  ): Promise<PhanMuc> {
    return this.phanMucService.update(id, dto);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Xóa phần mục (Admin)" })
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.phanMucService.delete(id);
  }
}
