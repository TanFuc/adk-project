// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
  };
}

export interface ApiError {
  success: boolean;
  error: {
    statusCode: number;
    message: string;
    details: string | string[] | null;
    path: string;
    timestamp: string;
  };
}

// Registration Types
export interface DangKyRequest {
  hoTen: string;
  soDienThoai: string;
  tinhThanh: string;
  quanHuyen: string;
  diaChi?: string;
}

export interface DangKyResponse {
  id: string;
  message: string;
  redirectUrl?: string;
}

export type TrangThai = 'CHO_XU_LY' | 'DA_LIEN_HE' | 'THANH_CONG' | 'TU_CHOI';

export interface DangKyDetail {
  id: string;
  hoTen: string;
  soDienThoai: string;
  tinhThanh: string;
  quanHuyen: string;
  diaChi?: string;
  trangThai: TrangThai;
  nguonDangKy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DangKyStats {
  total: number;
  choXuLy: number;
  daLienHe: number;
  thanhCong: number;
  tuChoi: number;
}

// Content Types
export type LoaiNoiDung = 'HERO' | 'FEATURE' | 'STATISTIC' | 'FAQ' | 'PARTNER' | 'TESTIMONIAL';

export interface NoiDung {
  id: string;
  loai: LoaiNoiDung;
  tieuDe: string;
  moTa?: string;
  noiDung: Record<string, unknown>;
  thuTu: number;
  hienThi: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  matKhau: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  admin: {
    id: string;
    email: string;
    hoTen: string;
    vaiTro: string;
  };
}

// Location Types
export interface Province {
  value: string;
  label: string;
}

export interface District {
  value: string;
  label: string;
}
