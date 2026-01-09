// Click Tracking Service
// This service helps track user interactions with CTA buttons

export interface TrackClickData {
  buttonName: string;
  pageUrl?: string;
  referrer?: string;
}

export interface ClickStats {
  buttonName: string;
  totalClicks: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

export interface ClickHistory {
  date: string;
  clicks: number;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Track a button click
 */
export async function trackClick(data: TrackClickData): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/click-tracking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buttonName: data.buttonName,
        pageUrl: data.pageUrl || window.location.href,
        referrer: data.referrer || document.referrer,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to track click:", error);
    return false;
  }
}

/**
 * Get click statistics (requires authentication)
 */
export async function getClickStats(
  buttonName?: string,
  token?: string
): Promise<ClickStats[]> {
  try {
    const url = new URL(`${API_BASE}/click-tracking/stats`);
    if (buttonName) {
      url.searchParams.append("buttonName", buttonName);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get click stats:", error);
    return [];
  }
}

/**
 * Get click history (requires authentication)
 */
export async function getClickHistory(
  days: number = 30,
  buttonName?: string,
  token?: string
): Promise<ClickHistory[]> {
  try {
    const url = new URL(`${API_BASE}/click-tracking/history`);
    url.searchParams.append("days", days.toString());
    
    if (buttonName) {
      url.searchParams.append("buttonName", buttonName);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get click history:", error);
    return [];
  }
}

/**
 * Available button names for tracking
 */
export const BUTTON_NAMES = {
  NAVBAR_REGISTER: "navbar_register_partnership",
  MOBILE_NAVBAR_REGISTER: "mobile_navbar_register_partnership",
  HERO_REGISTER: "hero_register_partnership",
  HERO_SECTION_CTA: "hero_section_cta",
  FOOTER_REGISTER: "footer_register_partnership",
  EVENTS_PAGE_REGISTER: "events_page_register_partnership",
  CONCEPT_PAGE_LEARN_MORE: "concept_page_learn_more",
  CONCEPT_PAGE_REGISTER: "concept_page_register_partnership",
} as const;
