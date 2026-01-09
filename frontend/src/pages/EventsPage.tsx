import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, ArrowRight, ImageOff, Clock, Sparkles } from "lucide-react";
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
      staggerChildren: 0.08,
      delayChildren: 0.1,
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
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    },
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
  const [isHovered, setIsHovered] = useState(false);
  const content = event.content as { highlights?: string[]; location?: string } | undefined;

  // Optimize image based on card type
  const optimizedImage = optimizeImage(
    event.coverImage,
    featured ? 'EVENT_CARD_FEATURED' : 'EVENT_CARD_REGULAR'
  );

  const eventDate = new Date(event.startDate);
  const now = new Date();
  const isUpcoming = eventDate > now;
  const isPast = event.endDate ? new Date(event.endDate) < now : eventDate < now;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Image with fixed aspect ratio */}
      <div className={`relative ${featured ? "aspect-video" : "aspect-[4/3]"} bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden`}>
        <AnimatePresence>
          {!imageError ? (
            <motion.img
              src={optimizedImage}
              alt={event.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="text-center">
                <ImageOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Không có ảnh</p>
              </div>
            </div>
          )}
        </AnimatePresence>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {event.isFeatured && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Nổi bật
            </motion.span>
          )}
          {isUpcoming && !isPast && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              Sắp diễn ra
            </motion.span>
          )}
        </div>

        {/* Date Badge - Improved design */}
        <motion.div 
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center shadow-xl z-10 min-w-[60px]"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-adk-green leading-none">
            {eventDate.getDate()}
          </div>
          <div className="text-[10px] text-gray-600 uppercase font-semibold leading-none mt-1">
            Tháng {eventDate.getMonth() + 1}
          </div>
        </motion.div>
      </div>

      {/* Content - Enhanced layout */}
      <div className="p-5 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2.5 line-clamp-2 group-hover:text-adk-green transition-colors duration-300 leading-tight">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Meta Info - Enhanced design */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-adk-green" />
            <span className="line-clamp-1 font-medium">
              {formatDate(event.startDate)}
              {event.endDate && event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          {content?.location && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-adk-green" />
              <span className="line-clamp-1 font-medium">{content.location}</span>
            </div>
          )}
        </div>

        {/* Highlights - Improved styling */}
        {content?.highlights && content.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {content.highlights.slice(0, featured ? 4 : 3).map((highlight, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-2.5 py-1 bg-gradient-to-r from-adk-green/10 to-adk-green/5 text-adk-green text-xs font-medium rounded-lg border border-adk-green/20"
              >
                {highlight}
              </motion.span>
            ))}
          </div>
        )}

        {/* View More Button - Enhanced */}
        <div className="pt-2 border-t border-gray-100">
          {event.redirectUrl ? (
            <RedirectButton
              href={event.redirectUrl}
              buttonName={`event_${event.id}_view_details`}
              className="inline-flex items-center gap-2 text-sm text-adk-green font-semibold hover:gap-3 transition-all p-0"
              variant="link"
              size="sm"
            >
              Xem chi tiết
            </RedirectButton>
          ) : (
            <Link
              to={`/su-kien/${event.id}`}
              className="inline-flex items-center gap-2 text-sm text-adk-green font-semibold hover:gap-3 transition-all group/link"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Hover border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-adk-green pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function EventsPage() {
  const { data: featuredEvents = [], isLoading: loadingFeatured } = useQuery<Event[]>({
    queryKey: ["events", "featured"],
    queryFn: eventApi.getFeatured,
  });

  const { data: allEvents = [], isLoading: loadingAll } = useQuery<Event[]>({
    queryKey: ["events", "all"],
    queryFn: eventApi.getAll,
  });

  // Show all events in "Tất cả sự kiện" section
  const regularEvents = allEvents;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Enhanced */}
      <section className="relative py-24 lg:py-36 bg-gradient-to-br from-adk-green via-adk-green-dark to-adk-blue overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container-full relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
              ✨ Khám phá ngay
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Sự Kiện & Đầu Tư ADK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Khám phá các sự kiện, hội thảo đầu tư và cơ hội hợp tác kinh doanh đặc biệt tại Siêu Thị Thuốc ADK
          </motion.p>
          
          {/* Stats or quick info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-6 lg:gap-12"
          >
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                {allEvents.length}+
              </div>
              <div className="text-sm text-white/80">Sự kiện</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                {featuredEvents.length}
              </div>
              <div className="text-sm text-white/80">Nổi bật</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/80">Miễn phí</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 lg:mb-16"
            >
              <span className="inline-block px-4 py-2 bg-adk-green/10 text-adk-green text-sm font-semibold rounded-full mb-4">
                🌟 Đừng bỏ lỡ
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Sự Kiện Nổi Bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Các cơ hội đầu tư và sự kiện quan trọng được nhiều đối tác quan tâm nhất
              </p>
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
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-4">
              📅 Lịch sự kiện
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tất Cả Sự Kiện
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá toàn bộ sự kiện, hội thảo và cơ hội đầu tư của ADK
            </p>
          </motion.div>

          {loadingAll ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-adk-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải sự kiện...</p>
            </div>
          ) : regularEvents.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">Chưa có sự kiện nào</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Các sự kiện mới sẽ được cập nhật sớm. Đăng ký ngay để không bỏ lỡ thông tin!
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Debug: Featured={featuredEvents.length}, All={allEvents.length}
              </p>
              <RedirectButton
                buttonName="empty_events_register"
                className="mx-auto"
              >
                Đăng Ký Nhận Thông Tin
              </RedirectButton>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-adk-blue via-adk-green to-adk-green-dark overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-6">
              💼 Cơ hội hợp tác
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Đừng bỏ lỡ các sự kiện sắp tới!
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Đăng ký hợp tác ngay để nhận thông tin sự kiện, hội thảo đầu tư và các ưu đãi đặc biệt dành riêng cho đối tác
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <RedirectButton
                size="lg"
                className="bg-white text-adk-green hover:bg-gray-50 shadow-2xl"
                buttonName="events_page_register_partnership"
              >
                Đăng Ký Hợp Tác Ngay
              </RedirectButton>
              <Link
                to="/lien-he"
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                Liên Hệ Tư Vấn
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Tư vấn miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Cam kết uy tín</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
