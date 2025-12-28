import { motion } from "framer-motion";
import type { PhanMuc } from "@/types";
import RedirectButton from "@/components/common/RedirectButton";
import { Phone } from "lucide-react";

interface CTABannerSectionProps {
  section: PhanMuc;
}

interface CTAContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryText?: string;
}

export default function CTABannerSection({ section }: CTABannerSectionProps) {
  const content = section.noiDung as CTAContent;
  const backgroundImage = section.hinhAnh[0];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-adk-green to-adk-blue" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-adk-green/90 to-adk-blue/90" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container-full relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6"
          >
            {content.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-white/80 mb-8 lg:mb-10"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6"
          >
            {section.ctaLink && (
              <RedirectButton
                href={section.ctaLink}
                size="lg"
                variant="primary"
                className="bg-white text-adk-green hover:bg-gray-100 shadow-2xl"
              >
                {content.ctaText || "Đăng Ký Ngay"}
              </RedirectButton>
            )}

            {content.secondaryText && (
              <div className="flex items-center gap-2 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{content.secondaryText}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
