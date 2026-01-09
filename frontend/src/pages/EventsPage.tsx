import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, ArrowRight, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { eventApi } from "@/api";
import type { Event } from "@/types";
import RedirectButton from "@/components/common/RedirectButton";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { optimizeImage } from "@/lib/image-optimizer";

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function EventCard({ event, featured = false }: { event: Event; featured?: boolean }) {
  const [imageError, setImageError] = useState(false);
  const content = event.content as { highlights?: string[]; location?: string } | undefined;

  // Optimize image based on card type
  const optimizedImage = optimizeImage(
    event.coverImage,
    featured ? 'EVENT_CARD_FEATURED' : 'EVENT_CARD_REGULAR'
  );

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className={`group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Image with fixed aspect ratio */}
      <div className={`relative ${featured ? "aspect-video" : "aspect-[4/3]"} bg-gray-100 overflow-hidden`}>
        {!imageError ? (
          <>
            <img
              src={optimizedImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <ImageOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Không có ảnh</p>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {event.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-adk-green text-white text-xs font-semibold rounded-full shadow-lg">
              Nổi bật
            </span>
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-lg p-1.5 text-center shadow-lg z-10">
          <div className="text-xl font-bold text-adk-green leading-none">
            {new Date(event.startDate).getDate()}
          </div>
          <div className="text-[10px] text-gray-500 uppercase leading-none mt-0.5">
            Th{new Date(event.startDate).getMonth() + 1}
          </div>
        </div>
      </div>

      {/* Content - Compact layout */}
      <div className="p-4 lg:p-5">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-adk-green transition-colors leading-tight">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {formatDate(event.startDate)}
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          {content?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{content.location}</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {content?.highlights && content.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {content.highlights.slice(0, 3).map((highlight, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-adk-green/10 text-adk-green text-[11px] rounded-full line-clamp-1"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* View More */}
        <Link
          to={`/su-kien/${event.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-adk-green font-medium hover:gap-2 transition-all"
        >
          Xem chi tiết
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const { data: featuredEvents = [] } = useQuery<Event[]>({
    queryKey: ["events", "featured"],
    queryFn: eventApi.getFeatured,
  });

  const { data: allEvents = [] } = useQuery<Event[]>({
    queryKey: ["events", "all"],
    queryFn: eventApi.getAll,
  });

  const regularEvents = allEvents.filter((e) => !featuredEvents.find((f) => f.id === e.id));

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-adk-green to-adk-green-dark overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container-full relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-4"
          >
            Sự Kiện ADK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Khám phá các sự kiện, chương trình khuyến mãi và hoạt động đặc biệt tại Siêu Thị Thuốc
            ADK
          </motion.p>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">Sự Kiện Nổi Bật</h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6 lg:gap-8"
            >
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} featured />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">Tất Cả Sự Kiện</h2>
          </motion.div>

          {regularEvents.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              {regularEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có sự kiện nào</h3>
              <p className="text-gray-500">
                Các sự kiện mới sẽ được cập nhật sớm. Vui lòng quay lại sau!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-adk-blue to-adk-green">
        <div className="container-full text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
          >
            Đừng bỏ lỡ các sự kiện sắp tới!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Đăng ký hợp tác ngay để nhận thông tin sự kiện và ưu đãi đặc biệt
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <RedirectButton
              size="lg"
              className="bg-white text-adk-green hover:bg-gray-100"
              buttonName="events_page_register_partnership"
            >
              Đăng Ký Hợp Tác
            </RedirectButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
