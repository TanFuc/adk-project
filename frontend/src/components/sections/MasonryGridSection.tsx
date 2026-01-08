import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PhanMuc } from "@/types";
import { X, ZoomIn, ImageOff } from "lucide-react";

interface MasonryGridSectionProps {
  section: PhanMuc;
}

interface MasonryContent {
  title?: string;
  subtitle?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function MasonryGridSection({ section }: MasonryGridSectionProps) {
  const content = section.content as MasonryContent;
  const images = section.images || [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getMasonryClass = (index: number) => {
    const patterns = [
      "col-span-2 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
    ];
    return patterns[index % patterns.length];
  };

  // Masonry Image Component with error handling
  function MasonryImage({
    src,
    alt,
    onClick
  }: {
    src: string;
    alt: string;
    onClick: () => void;
  }) {
    const [imageError, setImageError] = useState(false);

    return (
      <div
        onClick={onClick}
        className="w-full h-full cursor-pointer group"
      >
        {!imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <ImageOff className="w-8 h-8 text-gray-400 mx-auto mb-1" />
              <p className="text-gray-500 text-xs">Không có ảnh</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          {content.subtitle && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-adk-green/10 text-adk-green text-sm font-medium mb-4">
              {content.subtitle}
            </span>
          )}
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">{content.title}</h2>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[150px] lg:auto-rows-[200px]"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className={`${getMasonryClass(index)} relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100`}
            >
              <MasonryImage
                src={image}
                alt={`Hình ảnh ${index + 1}`}
                onClick={() => setSelectedImage(image)}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-6 h-6 text-gray-700" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={selectedImage}
              alt="Xem lớn"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
