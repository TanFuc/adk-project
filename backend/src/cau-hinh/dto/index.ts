import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCauHinhDto {
  @ApiProperty({
    description: 'Khóa cấu hình (unique)',
    example: 'site_name',
    maxLength: 100,
  })
  @IsString({ message: 'Khóa phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Khóa không được để trống' })
  @MaxLength(100, { message: 'Khóa không được quá 100 ký tự' })
  key: string;

  @ApiProperty({
    description: 'Giá trị cấu hình (JSON)',
    example: { vi: 'Nhà Thuốc ADK', en: 'ADK Pharmacy' },
  })
  @IsObject({ message: 'Giá trị phải là object JSON' })
  value: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Mô tả cấu hình',
    example: 'Tên website hiển thị',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được quá 500 ký tự' })
  moTa?: string;
}

export class UpdateCauHinhDto {
  @ApiPropertyOptional({
    description: 'Giá trị cấu hình (JSON)',
  })
  @IsOptional()
  @IsObject({ message: 'Giá trị phải là object JSON' })
  value?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Mô tả cấu hình',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được quá 500 ký tự' })
  moTa?: string;
}
