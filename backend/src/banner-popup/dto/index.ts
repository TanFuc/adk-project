import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUrl,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBannerPopupDto {
  @ApiProperty({
    description: "URL hình ảnh banner",
    example: "/images/popup-event.jpg",
  })
  @IsString({ message: "Hình ảnh phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Hình ảnh không được để trống" })
  hinhAnh: string;

  @ApiProperty({
    description: "URL chuyển hướng khi click",
    example: "https://bizmall.vn",
  })
  @IsUrl({}, { message: "Đường dẫn phải là URL hợp lệ" })
  @IsNotEmpty({ message: "Đường dẫn không được để trống" })
  duongDan: string;

  @ApiPropertyOptional({
    description: "Trạng thái hoạt động",
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái hoạt động phải là true/false" })
  hoatDong?: boolean;

  @ApiPropertyOptional({
    description: "Độ trễ hiển thị (ms)",
    example: 3000,
    minimum: 0,
    maximum: 30000,
  })
  @IsOptional()
  @IsInt({ message: "Độ trễ phải là số nguyên" })
  @Min(0, { message: "Độ trễ không được âm" })
  @Max(30000, { message: "Độ trễ không được quá 30 giây" })
  doTreHienThi?: number;

  @ApiPropertyOptional({
    description: "Thứ tự ưu tiên (số nhỏ = ưu tiên cao)",
    example: 0,
  })
  @IsOptional()
  @IsInt({ message: "Thứ tự ưu tiên phải là số nguyên" })
  @Min(0, { message: "Thứ tự ưu tiên không được âm" })
  thuTuUuTien?: number;
}

export class UpdateBannerPopupDto {
  @ApiPropertyOptional({
    description: "URL hình ảnh banner",
  })
  @IsOptional()
  @IsString({ message: "Hình ảnh phải là chuỗi ký tự" })
  hinhAnh?: string;

  @ApiPropertyOptional({
    description: "URL chuyển hướng khi click",
  })
  @IsOptional()
  @IsUrl({}, { message: "Đường dẫn phải là URL hợp lệ" })
  duongDan?: string;

  @ApiPropertyOptional({
    description: "Trạng thái hoạt động",
  })
  @IsOptional()
  @IsBoolean({ message: "Trạng thái hoạt động phải là true/false" })
  hoatDong?: boolean;

  @ApiPropertyOptional({
    description: "Độ trễ hiển thị (ms)",
  })
  @IsOptional()
  @IsInt({ message: "Độ trễ phải là số nguyên" })
  @Min(0, { message: "Độ trễ không được âm" })
  @Max(30000, { message: "Độ trễ không được quá 30 giây" })
  doTreHienThi?: number;

  @ApiPropertyOptional({
    description: "Thứ tự ưu tiên",
  })
  @IsOptional()
  @IsInt({ message: "Thứ tự ưu tiên phải là số nguyên" })
  @Min(0, { message: "Thứ tự ưu tiên không được âm" })
  thuTuUuTien?: number;
}
