import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsObject,
  IsArray,
  IsUrl,
  Min,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { LoaiBoCuc } from "@prisma/client";

export class CreatePhanMucDto {
  @ApiProperty({
    description: "Key định danh duy nhất",
    example: "hero_main",
  })
  @IsString({ message: "Key phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Key không được để trống" })
  @MaxLength(100, { message: "Key không được quá 100 ký tự" })
  key: string;

  @ApiProperty({
    enum: LoaiBoCuc,
    description: "Loại bố cục",
    example: "HERO_IMAGE",
  })
  @IsEnum(LoaiBoCuc, { message: "Loại bố cục không hợp lệ" })
  loaiBoCuc: LoaiBoCuc;

  @ApiProperty({
    description: "Nội dung (title, subtitle, richText)",
    example: {
      title: "ADK - Điểm đến cho lối sống khỏe mạnh",
      subtitle: "Mô hình Nhà thuốc GPP",
    },
  })
  @IsObject({ message: "Nội dung phải là object JSON" })
  noiDung: Record<string, unknown>;

  @ApiPropertyOptional({
    description: "Danh sách URL hình ảnh",
    example: ["/images/hero.jpg"],
  })
  @IsOptional()
  @IsArray({ message: "Hình ảnh phải là mảng" })
  @IsString({ each: true, message: "Mỗi URL hình ảnh phải là chuỗi" })
  hinhAnh?: string[];

  @ApiPropertyOptional({
    description: "Link CTA (redirect URL)",
    example: "https://bizmall.vn",
  })
  @IsOptional()
  @IsUrl({}, { message: "CTA Link phải là URL hợp lệ" })
  ctaLink?: string;

  @ApiPropertyOptional({
    description: "Thứ tự hiển thị",
    example: 0,
  })
  @IsOptional()
  @IsInt({ message: "Thứ tự phải là số nguyên" })
  @Min(0, { message: "Thứ tự không được âm" })
  thuTu?: number;

  @ApiPropertyOptional({
    description: "Hiển thị hay ẩn",
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái hiển thị phải là true/false" })
  hienThi?: boolean;
}

export class UpdatePhanMucDto {
  @ApiPropertyOptional({
    enum: LoaiBoCuc,
    description: "Loại bố cục",
  })
  @IsOptional()
  @IsEnum(LoaiBoCuc, { message: "Loại bố cục không hợp lệ" })
  loaiBoCuc?: LoaiBoCuc;

  @ApiPropertyOptional({
    description: "Nội dung (title, subtitle, richText)",
  })
  @IsOptional()
  @IsObject({ message: "Nội dung phải là object JSON" })
  noiDung?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: "Danh sách URL hình ảnh",
  })
  @IsOptional()
  @IsArray({ message: "Hình ảnh phải là mảng" })
  @IsString({ each: true, message: "Mỗi URL hình ảnh phải là chuỗi" })
  hinhAnh?: string[];

  @ApiPropertyOptional({
    description: "Link CTA (redirect URL)",
  })
  @IsOptional()
  @IsString({ message: "CTA Link phải là chuỗi" })
  ctaLink?: string | null;

  @ApiPropertyOptional({
    description: "Thứ tự hiển thị",
  })
  @IsOptional()
  @IsInt({ message: "Thứ tự phải là số nguyên" })
  @Min(0, { message: "Thứ tự không được âm" })
  thuTu?: number;

  @ApiPropertyOptional({
    description: "Hiển thị hay ẩn",
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái hiển thị phải là true/false" })
  hienThi?: boolean;
}

export class ReorderItemDto {
  @ApiProperty({ description: "ID của phần mục" })
  @IsString()
  id: string;

  @ApiProperty({ description: "Thứ tự mới" })
  @IsInt()
  @Min(0)
  thuTu: number;
}

export class ReorderDto {
  @ApiProperty({ type: [ReorderItemDto], description: "Danh sách phần mục cần sắp xếp lại" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
