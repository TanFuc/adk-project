/**
 * Image Optimization Utility
 * Tối ưu hóa URL ảnh cho hiển thị đẹp, rõ nét
 */

export interface ImageOptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png" | "auto";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

/**
 * Preset sizes cho các use cases khác nhau
 */
export const IMAGE_PRESETS = {
  // Event cards
  EVENT_CARD_FEATURED: { width: 1200, height: 675, quality: 85, format: "webp" as const }, // 16:9
  EVENT_CARD_REGULAR: { width: 800, height: 600, quality: 85, format: "webp" as const }, // 4:3

  // Gallery/Masonry
  GALLERY_THUMBNAIL: { width: 600, height: 600, quality: 80, format: "webp" as const },
  GALLERY_LARGE: { width: 1920, height: 1080, quality: 90, format: "webp" as const },

  // Popup/Banner
  POPUP_BANNER: { width: 800, height: 600, quality: 85, format: "webp" as const },

  // Hero sections
  HERO_IMAGE: { width: 1920, height: 1080, quality: 90, format: "webp" as const },

  // Thumbnails
  THUMBNAIL_SMALL: { width: 200, height: 200, quality: 75, format: "webp" as const },
  THUMBNAIL_MEDIUM: { width: 400, height: 400, quality: 80, format: "webp" as const },

  // Logo/Icons
  LOGO: { width: 200, height: 200, quality: 90, format: "png" as const },
  ICON: { width: 100, height: 100, quality: 90, format: "png" as const },
} as const;

/**
 * Optimize URL cho Cloudinary
 */
function optimizeCloudinary(url: string, options: ImageOptimizeOptions): string {
  const { width, height, quality = 80, format = "auto", fit = "cover" } = options;

  // Cloudinary transformation format
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${fit}`);
  transformations.push(`q_${quality}`);
  if (format !== "auto") transformations.push(`f_${format}`);

  // Insert transformations into Cloudinary URL
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex !== -1) {
    return (
      url.slice(0, uploadIndex + 8) + transformations.join(",") + "/" + url.slice(uploadIndex + 8)
    );
  }

  return url;
}

/**
 * Optimize URL cho Imgix
 */
function optimizeImgix(url: string, options: ImageOptimizeOptions): string {
  const { width, height, quality = 80, format = "auto", fit = "cover" } = options;

  const params = new URLSearchParams();

  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("fit", fit);
  params.set("q", quality.toString());
  if (format !== "auto") params.set("fm", format);
  params.set("auto", "compress,format");

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${params.toString()}`;
}

/**
 * Main function: Optimize image URL
 *
 * @param url - Original image URL
 * @param options - Optimization options hoặc preset name
 * @returns Optimized URL
 *
 * @example
 * // Sử dụng preset
 * optimizeImage('/images/event.jpg', 'EVENT_CARD_FEATURED')
 *
 * // Sử dụng custom options
 * optimizeImage('/images/event.jpg', { width: 800, height: 600, quality: 85 })
 */
export function optimizeImage(
  url: string | null | undefined,
  options: ImageOptimizeOptions | keyof typeof IMAGE_PRESETS = {}
): string {
  // Handle null/undefined
  if (!url) return "";

  // Handle empty string
  if (url.trim() === "") return "";

  // Get options from preset if string is provided
  const opts: ImageOptimizeOptions = typeof options === "string" ? IMAGE_PRESETS[options] : options;

  // Skip optimization for data URLs
  if (url.startsWith("data:")) return url;

  // Skip optimization for SVG
  if (url.endsWith(".svg")) return url;

  // Optimize based on service
  if (url.includes("cloudinary.com")) {
    return optimizeCloudinary(url, opts);
  }

  if (url.includes("imgix.net") || url.includes("imagekit.io")) {
    return optimizeImgix(url, opts);
  }

  // For local images or unsupported services, return original
  // TODO: Implement local image optimization if needed
  return url;
}

/**
 * Optimize array of image URLs
 */
export function optimizeImages(
  urls: (string | null | undefined)[] | null | undefined,
  options: ImageOptimizeOptions | keyof typeof IMAGE_PRESETS = {}
): string[] {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.map((url) => optimizeImage(url, options)).filter(Boolean);
}

/**
 * Get responsive srcset for image
 */
export function getResponsiveSrcSet(
  url: string | null | undefined,
  baseWidth: number = 800
): string {
  if (!url) return "";

  const sizes = [1, 1.5, 2]; // 1x, 1.5x, 2x for retina displays

  return sizes
    .map((scale) => {
      const width = Math.round(baseWidth * scale);
      const optimized = optimizeImage(url, { width, quality: 85 });
      return `${optimized} ${scale}x`;
    })
    .join(", ");
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, options?: ImageOptimizeOptions): void {
  if (!url) return;

  const optimized = optimizeImage(url, options);
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = optimized;
  document.head.appendChild(link);
}
