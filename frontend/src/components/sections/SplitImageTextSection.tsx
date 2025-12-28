import { motion } from "framer-motion";
import type { PhanMuc } from "@/types";
import { Pill, Leaf, Users } from "lucide-react";

interface SplitImageTextSectionProps {
  section: PhanMuc;
}

interface SplitContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Array<{ icon: string; text: string }>;
}

const iconMap: Record<string, typeof Pill> = {
  pharmacy: Pill,
  organic: Leaf,
  expert: Users,
};

export default function SplitImageTextSection({ section }: SplitImageTextSectionProps) {
  const content = section.noiDung as SplitContent;
  const leftImage = section.hinhAnh[0];
  const rightImage = section.hinhAnh[1];

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
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

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={leftImage || "/images/placeholder.jpg"}
                alt="Nhà thuốc"
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-adk-green/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-lg font-semibold">Nhà Thuốc GPP</span>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={rightImage || "/images/placeholder.jpg"}
                alt="Thực phẩm hữu cơ"
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-adk-blue/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-lg font-semibold">Siêu Thị Thực Phẩm Sạch</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description & Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 lg:mt-16 text-center max-w-4xl mx-auto"
        >
          <p className="text-lg lg:text-xl text-gray-600 mb-8">{content.description}</p>

          {content.features && content.features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {content.features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Pill;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 px-5 py-3 rounded-full bg-gray-100 hover:bg-adk-green/10 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-adk-green" />
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
