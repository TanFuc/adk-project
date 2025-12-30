import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { bannerPopupApi } from "@/api";
import type { BannerPopup } from "@/types";

const POPUP_DISMISSED_KEY = "adk_popup_dismissed";

export default function PopupManager() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { data: popup } = useQuery<BannerPopup | null>({
    queryKey: ["active-popup"],
    queryFn: bannerPopupApi.getActive,
    staleTime: 5 * 60 * 1000,
  });

  const handleClose = useCallback(() => {
    setIsVisible(false);
    sessionStorage.setItem(POPUP_DISMISSED_KEY, "true");
  }, []);

  const handleRedirect = useCallback(() => {
    if (popup?.duongDan) {
      window.location.href = popup.duongDan;
    }
  }, [popup]);

  useEffect(() => {
    if (!popup || hasShown) return;

    const wasDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY);
    if (wasDismissed) return;

    const delay = popup.doTreHienThi || 3000;
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShown(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [popup, hasShown]);

  if (!popup) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative max-w-lg w-full pointer-events-auto">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popup Content */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={handleRedirect}
                className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer group bg-gray-100"
              >
                {/* Image */}
                {!imageError ? (
                  <img
                    src={popup.hinhAnh}
                    alt="Sự kiện ADK"
                    className="w-full h-auto object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="text-center">
                      <ImageOff className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Không có ảnh sự kiện</p>
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                    <span className="text-sm font-medium">Click để xem chi tiết</span>
                  </div>
                </div>

                {/* Corner Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-adk-green text-white">
                    Hot Event
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
