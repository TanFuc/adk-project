import axios from "axios";
import type { PhanMuc, BannerPopup, SuKien, CauHinh, MoHinhKinhDoanh, HoiDapHopTac } from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Page Sections API
export const phanMucApi = {
  getAll: async (): Promise<PhanMuc[]> => {
    const { data } = await api.get("/phan-muc/public");
    return data.data || data;
  },

  getByKey: async (key: string): Promise<PhanMuc | null> => {
    const { data } = await api.get(`/phan-muc/public/key/${key}`);
    return data.data || data;
  },

  getByLoai: async (loaiBoCuc: string): Promise<PhanMuc[]> => {
    const { data } = await api.get(`/phan-muc/public/loai/${loaiBoCuc}`);
    return data.data || data;
  },
};

// Banner Popup API
export const bannerPopupApi = {
  getActive: async (): Promise<BannerPopup | null> => {
    const { data } = await api.get("/banner-popup/public/active");
    return data.data || data;
  },

  getAllActive: async (): Promise<BannerPopup[]> => {
    const { data } = await api.get("/banner-popup/public/all-active");
    return data.data || data;
  },
};

// Events API
export const suKienApi = {
  getAll: async (): Promise<SuKien[]> => {
    const { data } = await api.get("/su-kien/public");
    return data.data || data;
  },

  getFeatured: async (): Promise<SuKien[]> => {
    const { data } = await api.get("/su-kien/public/featured");
    return data.data || data;
  },

  getUpcoming: async (): Promise<SuKien[]> => {
    const { data } = await api.get("/su-kien/public/upcoming");
    return data.data || data;
  },

  getById: async (id: string): Promise<SuKien> => {
    const { data } = await api.get(`/su-kien/public/${id}`);
    return data.data || data;
  },
};

// Global Settings API
export const cauHinhApi = {
  get: async (key: string): Promise<CauHinh | null> => {
    try {
      const { data } = await api.get(`/cau-hinh/public/${key}`);
      return data.data || data;
    } catch {
      return null;
    }
  },
};

// Business Models API
export const moHinhKinhDoanhApi = {
  getAll: async (): Promise<MoHinhKinhDoanh[]> => {
    const { data } = await api.get("/mo-hinh-kinh-doanh/public");
    return data.data || data;
  },

  getById: async (id: string): Promise<MoHinhKinhDoanh> => {
    const { data } = await api.get(`/mo-hinh-kinh-doanh/public/${id}`);
    return data.data || data;
  },
};

// Partnership FAQs API
export const hoiDapHopTacApi = {
  getAll: async (): Promise<HoiDapHopTac[]> => {
    const { data } = await api.get("/hoi-dap-hop-tac/public");
    return data.data || data;
  },
};

export default api;
