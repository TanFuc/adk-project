import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { suKienApi } from "@/api";
import type { SuKien } from "@/types";
import RedirectButton from "@/components/common/RedirectButton";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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

function EventCard({ event, featured = false }: { event: SuKien; featured?: boolean }) {
  const content = event.noiDung as { highlights?: string[]; location?: string } | undefined;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative ${featured ? "aspect-video" : "aspect-[4/3]"}`}>
        <img
          src={event.anhBia}
          alt={event.tieuDe}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-event.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Featured Badge */}
        {event.noiBat && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-adk-green text-white text-xs font-semibold rounded-full">
              Sự kiện nổi bật
            </span>
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-lg p-2 text-center shadow-lg">
          <div className="text-2xl font-bold text-adk-green">
            {new Date(event.ngayBatDau).getDate()}
          </div>
          <div className="text-xs text-gray-500 uppercase">
            Th{new Date(event.ngayBatDau).getMonth() + 1}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-adk-green transition-colors">
          {event.tieuDe}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{event.moTa}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(event.ngayBatDau)}
              {event.ngayKetThuc && ` - ${formatDate(event.ngayKetThuc)}`}
            </span>
          </div>
          {content?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{content.location}</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {content?.highlights && content.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {content.highlights.slice(0, 3).map((highlight, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-adk-green/10 text-adk-green text-xs rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* View More */}
        <Link
          to={`/su-kien/${event.id}`}
          className="inline-flex items-center gap-2 text-adk-green font-medium hover:gap-3 transition-all"
        >
          Xem chi tiết
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const { data: featuredEvents = [] } = useQuery<SuKien[]>({
    queryKey: ["events", "featured"],
    queryFn: suKienApi.getFeatured,
  });

  const { data: allEvents = [] } = useQuery<SuKien[]>({
    queryKey: ["events", "all"],
    queryFn: suKienApi.getAll,
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
              href="https://bizmall.vn"
              size="lg"
              className="bg-white text-adk-green hover:bg-gray-100"
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
