import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PartnershipFaq } from "@/types";

// B2B Partnership FAQs - Fallback when no dynamic data
const defaultFaqs = [
  {
    question: "Tôi cần bao nhiêu vốn để bắt đầu?",
    answer:
      "Vốn đầu tư linh hoạt từ 500 triệu - 2 tỷ đồng tùy theo quy mô mặt bằng (40-100m2). Liên hệ để nhận bảng dự toán chi tiết phù hợp với điều kiện của bạn.",
  },
  {
    question: "ADK hỗ trợ nguồn hàng như thế nào?",
    answer:
      "Cung cấp danh mục sản phẩm chuẩn hóa gồm Thuốc, TPCN, Thực phẩm sạch và OCOP. Giá tốt nhất từ kho tổng, giao hàng định kỳ, hỗ trợ đổi trả hàng chậm luân chuyển.",
  },
  {
    question: "Tôi có được đào tạo nhân sự không?",
    answer:
      "Có. ADK đào tạo toàn diện cho dược sĩ và nhân viên về: Kỹ năng bán lẻ, Tư vấn dinh dưỡng, Sử dụng hệ thống ERP, và Quy trình vận hành chuẩn GPP.",
  },
  {
    question: "Thời gian hoàn vốn dự kiến là bao lâu?",
    answer:
      "Với vị trí tốt và vận hành đúng quy trình, thời gian hoàn vốn trung bình từ 18-24 tháng. Doanh thu trung bình từ 300-500 triệu/tháng tùy quy mô.",
  },
  {
    question: "ADK hỗ trợ marketing như thế nào?",
    answer:
      "Hỗ trợ marketing đa kênh: Fanpage chung, SEO địa phương, Chương trình khuyến mãi toàn hệ thống, Tài liệu truyền thông sẵn có. Chi phí marketing được chia sẻ trong hệ thống.",
  },
  {
    question: "Quy trình hợp tác như thế nào?",
    answer:
      "Quy trình 5 bước: (1) Đăng ký tư vấn - (2) Khảo sát mặt bằng - (3) Ký hợp đồng - (4) Setup cửa hàng (30-45 ngày) - (5) Khai trương và vận hành.",
  },
];

interface FAQSectionProps {
  faqs?: PartnershipFaq[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  // Use dynamic data if available, otherwise use defaults
  const displayFaqs = faqs && faqs.length > 0
    ? faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
    : defaultFaqs;
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-full">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-adk-green/10 text-adk-green rounded-full text-sm font-medium mb-4">
              Hỏi Đáp Hợp Tác
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Câu Hỏi <span className="text-adk-green">Thường Gặp</span>
            </h2>
            <p className="text-lg text-gray-600">
              Giải đáp thắc mắc cho nhà đầu tư và đối tác tiềm năng
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {displayFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg mb-3 px-6 border-none shadow-sm"
                >
                  <AccordionTrigger className="text-left hover:no-underline hover:text-adk-green">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA after FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-gray-600 mb-4">
              Còn thắc mắc khác? Liên hệ ngay để được tư vấn chi tiết.
            </p>
            <a href="tel:18001234" className="text-adk-green font-semibold hover:underline">
              Hotline: 1800-1234
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
