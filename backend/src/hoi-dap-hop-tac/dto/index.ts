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

export class CreateHoiDapHopTacDto {
  @ApiProperty({
    description: "Câu hỏi",
    example: "Tôi cần bao nhiêu vốn để bắt đầu?",
  })
  @IsString({ message: "Câu hỏi phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Câu hỏi không được để trống" })
  @MaxLength(500, { message: "Câu hỏi không được quá 500 ký tự" })
  cauHoi: string;

  @ApiProperty({
    description: "Câu trả lời",
    example: "Vốn đầu tư linh hoạt từ 500 triệu...",
  })
  @IsString({ message: "Câu trả lời phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Câu trả lời không được để trống" })
  traLoi: string;

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

export class UpdateHoiDapHopTacDto {
  @ApiPropertyOptional({
    description: "Câu hỏi",
  })
  @IsOptional()
  @IsString({ message: "Câu hỏi phải là chuỗi ký tự" })
  @MaxLength(500, { message: "Câu hỏi không được quá 500 ký tự" })
  cauHoi?: string;

  @ApiPropertyOptional({
    description: "Câu trả lời",
  })
  @IsOptional()
  @IsString({ message: "Câu trả lời phải là chuỗi ký tự" })
  traLoi?: string;

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
