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
  PhanMuc,
  BannerPopup,
  SuKien,
  MoHinhKinhDoanh,
  HoiDapHopTac,
  CauHinh,
  ReorderItem,
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

  // Page Sections
  async getPublicSections(): Promise<PhanMuc[]> {
    const response = await api.get<ApiResponse<PhanMuc[]>>("/phan-muc/public");
    return response.data.data;
  },

  // Banner Popup
  async getActivePopup(): Promise<BannerPopup | null> {
    const response = await api.get<ApiResponse<BannerPopup | null>>("/banner-popup/public/active");
    return response.data.data;
  },

  // Events
  async getPublicEvents(): Promise<SuKien[]> {
    const response = await api.get<ApiResponse<SuKien[]>>("/su-kien/public");
    return response.data.data;
  },

  async getFeaturedEvents(): Promise<SuKien[]> {
    const response = await api.get<ApiResponse<SuKien[]>>("/su-kien/public/featured");
    return response.data.data;
  },

  // Business Models
  async getPublicBusinessModels(): Promise<MoHinhKinhDoanh[]> {
    const response = await api.get<ApiResponse<MoHinhKinhDoanh[]>>("/mo-hinh-kinh-doanh/public");
    return response.data.data;
  },

  // Partnership FAQs
  async getPublicFAQs(): Promise<HoiDapHopTac[]> {
    const response = await api.get<ApiResponse<HoiDapHopTac[]>>("/hoi-dap-hop-tac/public");
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

  // === PHAN MUC (Page Sections) ===
  async getAllSections(): Promise<PhanMuc[]> {
    const response = await api.get<ApiResponse<PhanMuc[]>>("/phan-muc/admin");
    return response.data.data;
  },

  async createSection(data: Partial<PhanMuc>): Promise<PhanMuc> {
    const response = await api.post<ApiResponse<PhanMuc>>("/phan-muc/admin", data);
    return response.data.data;
  },

  async updateSection(id: string, data: Partial<PhanMuc>): Promise<PhanMuc> {
    const response = await api.patch<ApiResponse<PhanMuc>>(`/phan-muc/admin/${id}`, data);
    return response.data.data;
  },

  async deleteSection(id: string): Promise<void> {
    await api.delete(`/phan-muc/admin/${id}`);
  },

  async reorderSections(items: ReorderItem[]): Promise<void> {
    await api.patch("/phan-muc/admin/reorder", { items });
  },

  // === BANNER POPUP ===
  async getAllBanners(): Promise<BannerPopup[]> {
    const response = await api.get<ApiResponse<BannerPopup[]>>("/banner-popup/admin");
    return response.data.data;
  },

  async createBanner(data: Partial<BannerPopup>): Promise<BannerPopup> {
    const response = await api.post<ApiResponse<BannerPopup>>("/banner-popup/admin", data);
    return response.data.data;
  },

  async updateBanner(id: string, data: Partial<BannerPopup>): Promise<BannerPopup> {
    const response = await api.patch<ApiResponse<BannerPopup>>(`/banner-popup/admin/${id}`, data);
    return response.data.data;
  },

  async deleteBanner(id: string): Promise<void> {
    await api.delete(`/banner-popup/admin/${id}`);
  },

  async toggleBanner(id: string): Promise<BannerPopup> {
    const response = await api.patch<ApiResponse<BannerPopup>>(`/banner-popup/admin/${id}/toggle`);
    return response.data.data;
  },

  // === SU KIEN (Events) ===
  async getAllEvents(): Promise<SuKien[]> {
    const response = await api.get<ApiResponse<SuKien[]>>("/su-kien/admin");
    return response.data.data;
  },

  async createEvent(data: Partial<SuKien>): Promise<SuKien> {
    const response = await api.post<ApiResponse<SuKien>>("/su-kien/admin", data);
    return response.data.data;
  },

  async updateEvent(id: string, data: Partial<SuKien>): Promise<SuKien> {
    const response = await api.patch<ApiResponse<SuKien>>(`/su-kien/admin/${id}`, data);
    return response.data.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/su-kien/admin/${id}`);
  },

  async toggleEventFeatured(id: string): Promise<SuKien> {
    const response = await api.patch<ApiResponse<SuKien>>(`/su-kien/admin/${id}/toggle-featured`);
    return response.data.data;
  },

  // === MO HINH KINH DOANH (Business Models) ===
  async getAllBusinessModels(): Promise<MoHinhKinhDoanh[]> {
    const response = await api.get<ApiResponse<MoHinhKinhDoanh[]>>("/mo-hinh-kinh-doanh/admin");
    return response.data.data;
  },

  async createBusinessModel(data: Partial<MoHinhKinhDoanh>): Promise<MoHinhKinhDoanh> {
    const response = await api.post<ApiResponse<MoHinhKinhDoanh>>("/mo-hinh-kinh-doanh/admin", data);
    return response.data.data;
  },

  async updateBusinessModel(id: string, data: Partial<MoHinhKinhDoanh>): Promise<MoHinhKinhDoanh> {
    const response = await api.patch<ApiResponse<MoHinhKinhDoanh>>(
      `/mo-hinh-kinh-doanh/admin/${id}`,
      data,
    );
    return response.data.data;
  },

  async deleteBusinessModel(id: string): Promise<void> {
    await api.delete(`/mo-hinh-kinh-doanh/admin/${id}`);
  },

  async toggleBusinessModel(id: string): Promise<MoHinhKinhDoanh> {
    const response = await api.patch<ApiResponse<MoHinhKinhDoanh>>(
      `/mo-hinh-kinh-doanh/admin/${id}/toggle`,
    );
    return response.data.data;
  },

  async reorderBusinessModels(items: ReorderItem[]): Promise<void> {
    await api.patch("/mo-hinh-kinh-doanh/admin/reorder", { items });
  },

  // === HOI DAP HOP TAC (FAQs) ===
  async getAllFAQs(): Promise<HoiDapHopTac[]> {
    const response = await api.get<ApiResponse<HoiDapHopTac[]>>("/hoi-dap-hop-tac/admin");
    return response.data.data;
  },

  async createFAQ(data: Partial<HoiDapHopTac>): Promise<HoiDapHopTac> {
    const response = await api.post<ApiResponse<HoiDapHopTac>>("/hoi-dap-hop-tac/admin", data);
    return response.data.data;
  },

  async updateFAQ(id: string, data: Partial<HoiDapHopTac>): Promise<HoiDapHopTac> {
    const response = await api.patch<ApiResponse<HoiDapHopTac>>(`/hoi-dap-hop-tac/admin/${id}`, data);
    return response.data.data;
  },

  async deleteFAQ(id: string): Promise<void> {
    await api.delete(`/hoi-dap-hop-tac/admin/${id}`);
  },

  async toggleFAQ(id: string): Promise<HoiDapHopTac> {
    const response = await api.patch<ApiResponse<HoiDapHopTac>>(`/hoi-dap-hop-tac/admin/${id}/toggle`);
    return response.data.data;
  },

  async reorderFAQs(items: ReorderItem[]): Promise<void> {
    await api.patch("/hoi-dap-hop-tac/admin/reorder", { items });
  },

  // === CAU HINH (Settings) ===
  async getAllSettings(): Promise<CauHinh[]> {
    const response = await api.get<ApiResponse<CauHinh[]>>("/cau-hinh/admin");
    return response.data.data;
  },

  async upsertSetting(data: { key: string; value: unknown; moTa?: string }): Promise<CauHinh> {
    const response = await api.post<ApiResponse<CauHinh>>("/cau-hinh/admin", data);
    return response.data.data;
  },

  async updateSetting(key: string, data: { value: unknown; moTa?: string }): Promise<CauHinh> {
    const response = await api.patch<ApiResponse<CauHinh>>(`/cau-hinh/admin/${key}`, data);
    return response.data.data;
  },

  async deleteSetting(key: string): Promise<void> {
    await api.delete(`/cau-hinh/admin/${key}`);
  },
};

export default api;
