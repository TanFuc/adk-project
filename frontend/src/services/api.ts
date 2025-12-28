import axios, { AxiosError } from "axios";
import type {
  ApiResponse,
  ApiError,
  DangKyRequest,
  DangKyResponse,
  DangKyDetail,
  DangKyStats,
  NoiDung,
  LoginRequest,
  LoginResponse,
  TrangThai,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("admin");
      if (
        window.location.pathname.startsWith("/admin") &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Public API
export const publicApi = {
  // Registration
  async createDangKy(data: DangKyRequest): Promise<DangKyResponse> {
    const response = await api.post<ApiResponse<DangKyResponse>>("/dang-ky", data);
    return response.data.data;
  },

  // Content
  async getPublicContent(): Promise<Record<string, NoiDung[]>> {
    const response = await api.get<ApiResponse<Record<string, NoiDung[]>>>("/noi-dung/public");
    return response.data.data;
  },

  async getContentByType(loai: string): Promise<NoiDung[]> {
    const response = await api.get<ApiResponse<NoiDung[]>>(`/noi-dung/public/${loai}`);
    return response.data.data;
  },

  // Config
  async getPublicConfig(): Promise<Record<string, unknown>> {
    const response = await api.get<ApiResponse<Record<string, unknown>>>("/cau-hinh/public");
    return response.data.data;
  },
};

// Auth API
export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    return response.data.data;
  },

  async getMe(): Promise<{ email: string; vaiTro: string }> {
    const response = await api.get<ApiResponse<{ email: string; vaiTro: string }>>("/auth/me");
    return response.data.data;
  },
};

// Admin API
export const adminApi = {
  // Registrations
  async getRegistrations(
    page = 1,
    limit = 20,
    trangThai?: TrangThai
  ): Promise<{ data: DangKyDetail[]; total: number; pages: number }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (trangThai) params.append("trangThai", trangThai);
    const response = await api.get<
      ApiResponse<{ data: DangKyDetail[]; total: number; pages: number }>
    >(`/dang-ky/admin?${params}`);
    return response.data.data;
  },

  async getRegistrationStats(): Promise<DangKyStats> {
    const response = await api.get<ApiResponse<DangKyStats>>("/dang-ky/admin/stats");
    return response.data.data;
  },

  async getRegistrationById(id: string): Promise<DangKyDetail> {
    const response = await api.get<ApiResponse<DangKyDetail>>(`/dang-ky/admin/${id}`);
    return response.data.data;
  },

  async updateRegistrationStatus(id: string, trangThai: TrangThai): Promise<DangKyDetail> {
    const response = await api.patch<ApiResponse<DangKyDetail>>(`/dang-ky/admin/${id}/trang-thai`, {
      trangThai,
    });
    return response.data.data;
  },

  async deleteRegistration(id: string): Promise<void> {
    await api.delete(`/dang-ky/admin/${id}`);
  },

  // Content
  async getAllContent(): Promise<NoiDung[]> {
    const response = await api.get<ApiResponse<NoiDung[]>>("/noi-dung/admin");
    return response.data.data;
  },

  async createContent(data: Partial<NoiDung>): Promise<NoiDung> {
    const response = await api.post<ApiResponse<NoiDung>>("/noi-dung/admin", data);
    return response.data.data;
  },

  async updateContent(id: string, data: Partial<NoiDung>): Promise<NoiDung> {
    const response = await api.patch<ApiResponse<NoiDung>>(`/noi-dung/admin/${id}`, data);
    return response.data.data;
  },

  async deleteContent(id: string): Promise<void> {
    await api.delete(`/noi-dung/admin/${id}`);
  },
};

export default api;
