import { motion } from "framer-motion";
import type { PhanMuc } from "@/types";
import RedirectButton from "@/components/common/RedirectButton";

interface HeroImageSectionProps {
  section: PhanMuc;
}

interface HeroContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  stats?: Array<{ value: string; label: string }>;
}

export default function HeroImageSection({ section }: HeroImageSectionProps) {
  const content = section.noiDung as HeroContent;
  const backgroundImage = section.hinhAnh[1] || section.hinhAnh[0];
  const logoImage = section.hinhAnh[0];

  return (
    <section className="relative min-h-screen bg-gradient-adk py-12 lg:py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-adk-green/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-adk-blue/10 rounded-full blur-3xl" />
        {backgroundImage && (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      <div className="container-full relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-white shadow-xl shadow-adk-green/20 mb-8"
          >
            <img
              src={logoImage || "/logo.png"}
              alt="ADK Logo"
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 max-w-5xl"
          >
            {content.title?.split(" ").map((word, i) => (
              <span key={i} className={word.toLowerCase().includes("adk") ? "text-adk-green" : ""}>
                {word}{" "}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl"
          >
            {content.subtitle}
          </motion.p>

          {/* CTA Button */}
          {section.ctaLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <RedirectButton href={section.ctaLink} size="xl" variant="primary">
                {content.ctaText || "Đăng Ký Ngay"}
              </RedirectButton>
            </motion.div>
          )}

          {/* Stats */}
          {content.stats && content.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 lg:gap-16 mt-16 pt-8 border-t border-gray-200"
            >
              {content.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-5xl font-bold text-adk-green">{stat.value}</div>
                  <div className="text-sm lg:text-base text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
