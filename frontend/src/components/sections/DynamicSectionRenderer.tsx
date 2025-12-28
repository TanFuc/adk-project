import { motion } from "framer-motion";
import type { PhanMuc } from "@/types";
import HeroImageSection from "./HeroImageSection";
import SplitImageTextSection from "./SplitImageTextSection";
import BentoGridSection from "./BentoGridSection";
import MasonryGridSection from "./MasonryGridSection";
import CTABannerSection from "./CTABannerSection";
import CarouselSection from "./CarouselSection";

interface DynamicSectionRendererProps {
  sections: PhanMuc[];
}

export default function DynamicSectionRenderer({ sections }: DynamicSectionRendererProps) {
  const renderSection = (section: PhanMuc) => {
    switch (section.loaiBoCuc) {
      case "HERO_IMAGE":
      case "HERO_VIDEO":
        return <HeroImageSection key={section.id} section={section} />;
      case "SPLIT_IMAGE_TEXT":
        return <SplitImageTextSection key={section.id} section={section} />;
      case "BENTO_GRID":
        return <BentoGridSection key={section.id} section={section} />;
      case "MASONRY_GRID":
        return <MasonryGridSection key={section.id} section={section} />;
      case "CTA_BANNER":
        return <CTABannerSection key={section.id} section={section} />;
      case "CAROUSEL":
        return <CarouselSection key={section.id} section={section} />;
      case "TEXT_ONLY":
        return (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 lg:py-24"
          >
            <div className="container-full text-center max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {(section.noiDung as { title?: string }).title}
              </h2>
              <p className="text-lg text-gray-600">
                {(section.noiDung as { description?: string }).description}
              </p>
            </div>
          </motion.section>
        );
      default:
        return null;
    }
  };

  return <>{sections.sort((a, b) => a.thuTu - b.thuTu).map(renderSection)}</>;
}
