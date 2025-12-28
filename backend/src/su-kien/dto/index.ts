import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsDateString,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSuKienDto {
  @ApiProperty({
    description: "Tiêu đề sự kiện",
    example: "Khai trương Siêu Thị Thuốc ADK Flagship",
    maxLength: 500,
  })
  @IsString({ message: "Tiêu đề phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  @MaxLength(500, { message: "Tiêu đề không được quá 500 ký tự" })
  tieuDe: string;

  @ApiPropertyOptional({
    description: "Mô tả sự kiện",
    example: "Thăm khám sức khỏe miễn phí, mời chuyên gia dinh dưỡng.",
  })
  @IsOptional()
  @IsString({ message: "Mô tả phải là chuỗi ký tự" })
  moTa?: string;

  @ApiProperty({
    description: "Ngày bắt đầu",
    example: "2025-01-15T09:00:00Z",
  })
  @IsDateString({}, { message: "Ngày bắt đầu phải là định dạng ISO date" })
  ngayBatDau: string;

  @ApiPropertyOptional({
    description: "Ngày kết thúc",
    example: "2025-01-20T18:00:00Z",
  })
  @IsOptional()
  @IsDateString({}, { message: "Ngày kết thúc phải là định dạng ISO date" })
  ngayKetThuc?: string;

  @ApiProperty({
    description: "URL ảnh bìa",
    example: "/images/events/khai-truong.jpg",
  })
  @IsString({ message: "Ảnh bìa phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Ảnh bìa không được để trống" })
  anhBia: string;

  @ApiPropertyOptional({
    description: "Bộ sưu tập ảnh gallery",
    example: ["/images/events/gallery-1.jpg", "/images/events/gallery-2.jpg"],
  })
  @IsOptional()
  @IsArray({ message: "Bộ sưu tập ảnh phải là mảng" })
  @IsString({ each: true, message: "Mỗi URL ảnh phải là chuỗi" })
  boSuuTapAnh?: string[];

  @ApiPropertyOptional({
    description: "Nội dung bổ sung (JSON)",
    example: { highlights: ["Khám miễn phí", "Tư vấn dinh dưỡng"] },
  })
  @IsOptional()
  @IsObject({ message: "Nội dung phải là object JSON" })
  noiDung?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: "Sự kiện nổi bật",
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái nổi bật phải là true/false" })
  noiBat?: boolean;

  @ApiPropertyOptional({
    description: "Hiển thị hay ẩn",
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái hiển thị phải là true/false" })
  hienThi?: boolean;
}

export class UpdateSuKienDto {
  @ApiPropertyOptional({
    description: "Tiêu đề sự kiện",
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: "Tiêu đề phải là chuỗi ký tự" })
  @MaxLength(500, { message: "Tiêu đề không được quá 500 ký tự" })
  tieuDe?: string;

  @ApiPropertyOptional({
    description: "Mô tả sự kiện",
  })
  @IsOptional()
  @IsString({ message: "Mô tả phải là chuỗi ký tự" })
  moTa?: string;

  @ApiPropertyOptional({
    description: "Ngày bắt đầu",
  })
  @IsOptional()
  @IsDateString({}, { message: "Ngày bắt đầu phải là định dạng ISO date" })
  ngayBatDau?: string;

  @ApiPropertyOptional({
    description: "Ngày kết thúc",
  })
  @IsOptional()
  @IsDateString({}, { message: "Ngày kết thúc phải là định dạng ISO date" })
  ngayKetThuc?: string | null;

  @ApiPropertyOptional({
    description: "URL ảnh bìa",
  })
  @IsOptional()
  @IsString({ message: "Ảnh bìa phải là chuỗi ký tự" })
  anhBia?: string;

  @ApiPropertyOptional({
    description: "Bộ sưu tập ảnh gallery",
  })
  @IsOptional()
  @IsArray({ message: "Bộ sưu tập ảnh phải là mảng" })
  @IsString({ each: true, message: "Mỗi URL ảnh phải là chuỗi" })
  boSuuTapAnh?: string[];

  @ApiPropertyOptional({
    description: "Nội dung bổ sung (JSON)",
  })
  @IsOptional()
  @IsObject({ message: "Nội dung phải là object JSON" })
  noiDung?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: "Sự kiện nổi bật",
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái nổi bật phải là true/false" })
  noiBat?: boolean;

  @ApiPropertyOptional({
    description: "Hiển thị hay ẩn",
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái hiển thị phải là true/false" })
  hienThi?: boolean;
}
