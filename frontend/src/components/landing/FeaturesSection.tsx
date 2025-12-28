import { motion } from "framer-motion";
import { TrendingUp, Cpu, Package, BadgeCheck, Wallet, Store } from "lucide-react";

// B2B Investment Benefits - NOT B2C customer features
const investmentBenefits = [
  {
    icon: TrendingUp,
    title: "Đa Dạng Nguồn Thu",
    description:
      "Tối ưu lợi nhuận từ thuốc GPP và thực phẩm sạch. Biên lợi nhuận gộp 25-40% tùy nhóm hàng.",
  },
  {
    icon: Cpu,
    title: "Vận Hành Tự Động",
    description: "Hệ thống ERP quản lý tồn kho, App bán hàng, Hóa đơn điện tử tích hợp sẵn.",
  },
  {
    icon: Package,
    title: "Chuỗi Cung Ứng Chủ Động",
    description: "Kết nối trực tiếp nhà máy & vùng nguyên liệu. Giá gốc, không qua trung gian.",
  },
  {
    icon: BadgeCheck,
    title: "Thương Hiệu Uy Tín",
    description:
      "Hệ thống nhận diện thương hiệu đồng bộ, chuyên nghiệp. Được khách hàng tin tưởng.",
  },
  {
    icon: Wallet,
    title: "Hỗ Trợ Vốn",
    description: "Tài trợ vốn nhập hàng ban đầu, chi phí vận hành tháng đầu tiên.",
  },
  {
    icon: Store,
    title: "Setup Trọn Gói",
    description: "Thiết kế, thi công cửa hàng từ A-Z. Bàn giao trong 30-45 ngày.",
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
          <span className="inline-block px-4 py-1.5 bg-adk-green/10 text-adk-green rounded-full text-sm font-medium mb-4">
            Lợi Ích Đầu Tư
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn <span className="text-adk-green">ADK</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mô hình kinh doanh đã được kiểm chứng với đầy đủ hỗ trợ từ hệ thống. Tối ưu lợi nhuận,
            giảm thiểu rủi ro.
          </p>
        </motion.div>

        {/* Investment Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {investmentBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 rounded-xl bg-gray-50 hover:bg-adk-green/5 border border-transparent hover:border-adk-green/20 transition-all duration-300 hover-lift"
            >
              <div className="w-14 h-14 rounded-xl bg-adk-green/10 flex items-center justify-center mb-4 group-hover:bg-adk-green group-hover:text-white transition-colors">
                <benefit.icon className="w-7 h-7 text-adk-green group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {[
            { value: "25-40%", label: "Biên lợi nhuận" },
            { value: "18-24", label: "Tháng hoàn vốn" },
            { value: "300-500tr", label: "Doanh thu/tháng" },
            { value: "30-45", label: "Ngày setup" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-adk-green/5 to-adk-blue/5"
            >
              <div className="text-3xl lg:text-4xl font-bold text-adk-green mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
