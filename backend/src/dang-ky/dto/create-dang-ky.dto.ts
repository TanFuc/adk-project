import { IsString, IsNotEmpty, Matches, MinLength, MaxLength, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDangKyDto {
  @ApiProperty({
    description: "Họ và tên khách hàng",
    example: "Nguyễn Văn A",
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: "Họ và tên phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Họ và tên không được để trống" })
  @MinLength(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
  @MaxLength(100, { message: "Họ và tên không được quá 100 ký tự" })
  hoTen: string;

  @ApiProperty({
    description: "Số điện thoại liên hệ",
    example: "0901234567",
  })
  @IsString({ message: "Số điện thoại phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Số điện thoại không được để trống" })
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: "Số điện thoại không đúng định dạng (VD: 0901234567 hoặc +84901234567)",
  })
  soDienThoai: string;

  @ApiProperty({
    description: "Tỉnh/Thành phố",
    example: "TP. Hồ Chí Minh",
  })
  @IsString({ message: "Tỉnh/Thành phố phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Vui lòng chọn Tỉnh/Thành phố" })
  @MaxLength(100, { message: "Tỉnh/Thành phố không được quá 100 ký tự" })
  tinhThanh: string;

  @ApiProperty({
    description: "Quận/Huyện",
    example: "Quận 1",
  })
  @IsString({ message: "Quận/Huyện phải là chuỗi ký tự" })
  @IsNotEmpty({ message: "Vui lòng chọn Quận/Huyện" })
  @MaxLength(100, { message: "Quận/Huyện không được quá 100 ký tự" })
  quanHuyen: string;

  @ApiPropertyOptional({
    description: "Địa chỉ chi tiết (số nhà, đường, phường/xã)",
    example: "123 Nguyễn Huệ, Phường Bến Nghé",
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: "Địa chỉ phải là chuỗi ký tự" })
  @MaxLength(500, { message: "Địa chỉ không được quá 500 ký tự" })
  diaChi?: string;
}
