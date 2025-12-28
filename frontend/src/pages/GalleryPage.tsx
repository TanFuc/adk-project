import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { phanMucApi } from "@/api";
import type { PhanMuc } from "@/types";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

const categories = [
  { key: "all", label: "Tất Cả" },
  { key: "store", label: "Cửa Hàng" },
  { key: "products", label: "Sản Phẩm" },
  { key: "events", label: "Sự Kiện" },
  { key: "team", label: "Đội Ngũ" },
];

// Mock gallery data - In production, this would come from API
const galleryImages = [
  { id: 1, src: "/images/gallery/store-1.jpg", category: "store", title: "Cửa hàng ADK Quận 1" },
  { id: 2, src: "/images/gallery/store-2.jpg", category: "store", title: "Không gian mua sắm" },
  {
    id: 3,
    src: "/images/gallery/products-1.jpg",
    category: "products",
    title: "Kệ thuốc chất lượng",
  },
  { id: 4, src: "/images/gallery/products-2.jpg", category: "products", title: "Thực phẩm hữu cơ" },
  { id: 5, src: "/images/gallery/event-1.jpg", category: "events", title: "Sự kiện khai trương" },
  {
    id: 6,
    src: "/images/gallery/event-2.jpg",
    category: "events",
    title: "Chương trình khuyến mãi",
  },
  { id: 7, src: "/images/gallery/team-1.jpg", category: "team", title: "Đội ngũ dược sĩ" },
  { id: 8, src: "/images/gallery/team-2.jpg", category: "team", title: "Tư vấn khách hàng" },
  { id: 9, src: "/images/gallery/store-3.jpg", category: "store", title: "Quầy thanh toán" },
  { id: 10, src: "/images/gallery/products-3.jpg", category: "products", title: "Sản phẩm OCOP" },
  { id: 11, src: "/images/gallery/event-3.jpg", category: "events", title: "Hội thảo sức khỏe" },
  { id: 12, src: "/images/gallery/store-4.jpg", category: "store", title: "Khu thực phẩm sạch" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { data: _sections = [] } = useQuery<PhanMuc[]>({
    queryKey: ["sections", "gallery"],
    queryFn: () => phanMucApi.getByLoai("MASONRY_GRID"),
  });

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1
    );
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1
    );
  };

  const getMasonryClass = (index: number) => {
    const patterns = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
    ];
    return patterns[index % patterns.length];
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/gallery/hero-bg.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="container-full relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
          >
            Thư Viện Hình Ảnh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Khám phá không gian và hoạt động tại Siêu Thị Thuốc ADK
          </motion.p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b sticky top-0 z-40">
        <div className="container-full">
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-adk-green text-white shadow-lg shadow-adk-green/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 lg:py-20">
        <div className="container-full">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[150px] lg:auto-rows-[200px]"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                onClick={() => setSelectedImageIndex(index)}
                className={`${getMasonryClass(index)} relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.jpg";
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium">{image.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImageIndex].src}
                alt={filteredImages[selectedImageIndex].title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white text-lg font-medium">
                  {filteredImages[selectedImageIndex].title}
                </p>
                <p className="text-white/50 text-sm mt-1">
                  {selectedImageIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
