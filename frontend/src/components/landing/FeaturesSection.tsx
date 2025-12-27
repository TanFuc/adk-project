import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  BadgeCheck,
  HeartPulse,
  Truck,
  Phone,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Thuốc Chính Hãng',
    description:
      'Cam kết 100% thuốc chính hãng, nguồn gốc rõ ràng, được cấp phép bởi Bộ Y tế.',
  },
  {
    icon: BadgeCheck,
    title: 'Dược Sĩ Chuyên Nghiệp',
    description:
      'Đội ngũ dược sĩ có chứng chỉ hành nghề, tư vấn tận tâm và chuyên nghiệp.',
  },
  {
    icon: Clock,
    title: 'Phục Vụ 24/7',
    description:
      'Mở cửa phục vụ 24/7, đáp ứng nhu cầu khẩn cấp mọi lúc mọi nơi.',
  },
  {
    icon: HeartPulse,
    title: 'Tư Vấn Sức Khỏe',
    description:
      'Tư vấn sức khỏe miễn phí, hướng dẫn sử dụng thuốc đúng cách.',
  },
  {
    icon: Truck,
    title: 'Giao Hàng Nhanh',
    description:
      'Giao hàng nhanh trong 2 giờ nội thành, miễn phí cho đơn từ 200K.',
  },
  {
    icon: Phone,
    title: 'Hỗ Trợ Tận Tình',
    description:
      'Hotline hỗ trợ 24/7, giải đáp mọi thắc mắc của khách hàng.',
  },
];

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn <span className="text-adk-green">Nhà Thuốc ADK</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất với
            chất lượng hàng đầu và giá cả hợp lý.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 rounded-xl bg-gray-50 hover:bg-adk-green/5 border border-transparent hover:border-adk-green/20 transition-all duration-300 hover-lift"
            >
              <div className="w-14 h-14 rounded-xl bg-adk-green/10 flex items-center justify-center mb-4 group-hover:bg-adk-green group-hover:text-white transition-colors">
                <feature.icon className="w-7 h-7 text-adk-green group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
