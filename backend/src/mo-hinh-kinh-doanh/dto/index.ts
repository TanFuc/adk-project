import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  MaxLength,
  IsArray,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateMoHinhKinhDoanhDto {
  @ApiProperty({
    description: "Tên mô hình kinh doanh",
    example: "Đa Dạng Nguồn Thu",
  })
  @IsString({ message: "Tên phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Tên không được để trống" })
  @MaxLength(200, { message: "Tên không được quá 200 ký tự" })
  ten: string;

  @ApiProperty({
    description: "Mô tả chi tiết",
    example: "Tối ưu lợi nhuận từ thuốc GPP và thực phẩm sạch...",
  })
  @IsString({ message: "Mô tả phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Mô tả không được để trống" })
  moTa: string;

  @ApiPropertyOptional({
    description: "URL icon",
    example: "/icons/business-model-1.svg",
  })
  @IsOptional()
  @IsString({ message: "URL icon phải là chuỗi ký tự" })
  anhIcon?: string;

  @ApiPropertyOptional({
    description: "Mô tả tiềm năng lợi nhuận",
    example: "25-40% biên lợi nhuận",
  })
  @IsOptional()
  @IsString({ message: "Tiềm năng lợi nhuận phải là chuỗi ký tự" })
  tiemNangLoiNhuan?: string;

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

export class UpdateMoHinhKinhDoanhDto {
  @ApiPropertyOptional({
    description: "Tên mô hình kinh doanh",
  })
  @IsOptional()
  @IsString({ message: "Tên phải là chuỗi ký tự" })
  @MaxLength(200, { message: "Tên không được quá 200 ký tự" })
  ten?: string;

  @ApiPropertyOptional({
    description: "Mô tả chi tiết",
  })
  @IsOptional()
  @IsString({ message: "Mô tả phải là chuỗi ký tự" })
  moTa?: string;

  @ApiPropertyOptional({
    description: "URL icon",
  })
  @IsOptional()
  @IsString({ message: "URL icon phải là chuỗi ký tự" })
  anhIcon?: string | null;

  @ApiPropertyOptional({
    description: "Mô tả tiềm năng lợi nhuận",
  })
  @IsOptional()
  @IsString({ message: "Tiềm năng lợi nhuận phải là chuỗi ký tự" })
  tiemNangLoiNhuan?: string | null;

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
  @ApiProperty({ description: "ID của item" })
  @IsString()
  id: string;

  @ApiProperty({ description: "Thứ tự mới" })
  @IsInt()
  @Min(0)
  thuTu: number;
}

export class ReorderDto {
  @ApiProperty({ type: [ReorderItemDto], description: "Danh sách item cần sắp xếp lại" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
