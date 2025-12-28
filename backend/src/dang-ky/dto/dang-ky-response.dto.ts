import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TrangThai } from "@prisma/client";

export class DangKyResponseDto {
  @ApiProperty({ description: "ID đăng ký" })
  id: string;

  @ApiProperty({ description: "Thông báo kết quả" })
  message: string;

  @ApiPropertyOptional({ description: "URL chuyển hướng sau đăng ký" })
  redirectUrl?: string;
}

export class DangKyDetailDto {
  @ApiProperty({ description: "ID đăng ký" })
  id: string;

  @ApiProperty({ description: "Họ và tên" })
  hoTen: string;

  @ApiProperty({ description: "Số điện thoại (đã mã hóa hiển thị)" })
  soDienThoai: string;

  @ApiProperty({ description: "Tỉnh/Thành phố" })
  tinhThanh: string;

  @ApiProperty({ description: "Quận/Huyện" })
  quanHuyen: string;

  @ApiPropertyOptional({ description: "Địa chỉ chi tiết" })
  diaChi?: string;

  @ApiProperty({ enum: TrangThai, description: "Trạng thái đăng ký" })
  trangThai: TrangThai;

  @ApiProperty({ description: "Nguồn đăng ký" })
  nguonDangKy: string;

  @ApiProperty({ description: "Ngày tạo" })
  createdAt: Date;

  @ApiProperty({ description: "Ngày cập nhật" })
  updatedAt: Date;
}

export class UpdateTrangThaiDto {
  @ApiProperty({
    enum: TrangThai,
    description: "Trạng thái mới",
    example: "DA_LIEN_HE",
  })
  trangThai: TrangThai;
}

export class DangKyStatsDto {
  @ApiProperty({ description: "Tổng số đăng ký" })
  total: number;

  @ApiProperty({ description: "Số đang chờ xử lý" })
  choXuLy: number;

  @ApiProperty({ description: "Số đã liên hệ" })
  daLienHe: number;

  @ApiProperty({ description: "Số thành công" })
  thanhCong: number;

  @ApiProperty({ description: "Số từ chối" })
  tuChoi: number;
}
