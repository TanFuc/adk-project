import { motion } from "framer-motion";
import type { PhanMuc } from "@/types";
import { Badge, Cpu, Package, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoGridSectionProps {
  section: PhanMuc;
}

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  size: "small" | "medium" | "large";
}

interface BentoContent {
  title?: string;
  subtitle?: string;
  items?: BentoItem[];
}

const iconMap: Record<string, typeof Badge> = {
  badge: Badge,
  cpu: Cpu,
  package: Package,
  handshake: Users2,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

export default function BentoGridSection({ section }: BentoGridSectionProps) {
  const content = section.noiDung as BentoContent;
  const items = content.items || [];

  const getGridClass = (size: string, index: number) => {
    if (size === "large") {
      return index % 2 === 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-2";
    }
    if (size === "medium") {
      return "lg:col-span-1 lg:row-span-1";
    }
    return "";
  };

  const getBackgroundClass = (index: number) => {
    const colors = [
      "bg-gradient-to-br from-adk-green/10 to-adk-green/5 hover:from-adk-green/15 hover:to-adk-green/10",
      "bg-gradient-to-br from-adk-blue/10 to-adk-blue/5 hover:from-adk-blue/15 hover:to-adk-blue/10",
      "bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-150 hover:to-purple-100",
      "bg-gradient-to-br from-orange-100 to-orange-50 hover:from-orange-150 hover:to-orange-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
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

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr"
        >
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || Badge;
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={cn(
                  "group relative p-6 lg:p-8 rounded-2xl transition-all duration-300",
                  "border border-transparent hover:border-adk-green/20",
                  "shadow-sm hover:shadow-xl",
                  getGridClass(item.size, index),
                  getBackgroundClass(index)
                )}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 lg:mb-6 group-hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-adk-green" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/30 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
