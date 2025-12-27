import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsObject,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoaiNoiDung } from '@prisma/client';

export class CreateNoiDungDto {
  @ApiProperty({
    enum: LoaiNoiDung,
    description: 'Loại nội dung',
    example: 'HERO',
  })
  @IsEnum(LoaiNoiDung, { message: 'Loại nội dung không hợp lệ' })
  loai: LoaiNoiDung;

  @ApiProperty({
    description: 'Tiêu đề nội dung',
    example: 'Chào mừng đến Nhà Thuốc ADK',
    maxLength: 500,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(500, { message: 'Tiêu đề không được quá 500 ký tự' })
  tieuDe: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn',
    example: 'Nhà thuốc uy tín hàng đầu Việt Nam',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  moTa?: string;

  @ApiProperty({
    description: 'Nội dung chi tiết (JSON linh hoạt)',
    example: { image: '/hero.jpg', buttonText: 'Đăng ký ngay' },
  })
  @IsObject({ message: 'Nội dung phải là object JSON' })
  noiDung: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Thứ tự hiển thị',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Thứ tự phải là số nguyên' })
  @Min(0, { message: 'Thứ tự không được âm' })
  thuTu?: number;

  @ApiPropertyOptional({
    description: 'Hiển thị hay ẩn',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hiển thị phải là true/false' })
  hienThi?: boolean;
}

export class UpdateNoiDungDto {
  @ApiPropertyOptional({
    description: 'Tiêu đề nội dung',
    example: 'Chào mừng đến Nhà Thuốc ADK',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Tiêu đề không được quá 500 ký tự' })
  tieuDe?: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  moTa?: string;

  @ApiPropertyOptional({
    description: 'Nội dung chi tiết (JSON linh hoạt)',
  })
  @IsOptional()
  @IsObject({ message: 'Nội dung phải là object JSON' })
  noiDung?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Thứ tự hiển thị',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Thứ tự phải là số nguyên' })
  @Min(0, { message: 'Thứ tự không được âm' })
  thuTu?: number;

  @ApiPropertyOptional({
    description: 'Hiển thị hay ẩn',
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hiển thị phải là true/false' })
  hienThi?: boolean;
}
