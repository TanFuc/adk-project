import axios from "axios";
import type { Section, BannerPopup, Event, Configuration, BusinessModel, PartnershipFaq } from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Page Sections API
export const sectionApi = {
  getAll: async (): Promise<Section[]> => {
    const { data } = await api.get("/section/public");
    return data.data || data;
  },

  getByKey: async (key: string): Promise<Section | null> => {
    const { data } = await api.get(`/section/public/key/${key}`);
    return data.data || data;
  },

  getByLayoutType: async (layoutType: string): Promise<Section[]> => {
    const { data } = await api.get(`/section/public/layout/${layoutType}`);
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
export const eventApi = {
  getAll: async (): Promise<Event[]> => {
    const { data } = await api.get("/event/public");
    return data.data || data;
  },

  getFeatured: async (): Promise<Event[]> => {
    const { data } = await api.get("/event/public/featured");
    return data.data || data;
  },

  getUpcoming: async (): Promise<Event[]> => {
    const { data } = await api.get("/event/public/upcoming");
    return data.data || data;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await api.get(`/event/public/${id}`);
    return data.data || data;
  },
};

// Global Settings API
export const configurationApi = {
  get: async (key: string): Promise<Configuration | null> => {
    try {
      const { data } = await api.get(`/configuration/public/${key}`);
      return data.data || data;
    } catch {
      return null;
    }
  },

  getLogo: async (): Promise<Configuration | null> => {
    try {
      const { data } = await api.get("/configuration/public/logo");
      return data.data || data;
    } catch {
      return null;
    }
  },
};

// Business Models API
export const businessModelApi = {
  getAll: async (): Promise<BusinessModel[]> => {
    const { data } = await api.get("/business-model/public");
    return data.data || data;
  },

  getById: async (id: string): Promise<BusinessModel> => {
    const { data } = await api.get(`/business-model/public/${id}`);
    return data.data || data;
  },
};

// Partnership FAQs API
export const partnershipFaqApi = {
  getAll: async (): Promise<PartnershipFaq[]> => {
    const { data } = await api.get("/partnership-faq/public");
    return data.data || data;
  },
};

// Legacy exports for backward compatibility (deprecated)
export const phanMucApi = sectionApi;
export const suKienApi = eventApi;
export const cauHinhApi = configurationApi;
export const moHinhKinhDoanhApi = businessModelApi;
export const hoiDapHopTacApi = partnershipFaqApi;

export default api;
