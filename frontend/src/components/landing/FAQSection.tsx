import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Làm thế nào để đăng ký nhận ưu đãi?',
    answer:
      'Bạn chỉ cần điền đầy đủ thông tin vào form đăng ký ở phần đầu trang. Sau khi đăng ký thành công, chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận và gửi ưu đãi.',
  },
  {
    question: 'Thuốc có được bảo đảm chính hãng không?',
    answer:
      'Tất cả sản phẩm tại Nhà Thuốc ADK đều là thuốc chính hãng, có nguồn gốc xuất xứ rõ ràng và được cấp phép lưu hành bởi Bộ Y tế. Chúng tôi cam kết hoàn tiền 200% nếu phát hiện hàng giả.',
  },
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer:
      'Đối với nội thành TP.HCM và Hà Nội, thời gian giao hàng từ 2-4 giờ. Đối với các tỉnh thành khác, thời gian giao hàng từ 1-3 ngày làm việc tùy theo khu vực.',
  },
  {
    question: 'Có được tư vấn sử dụng thuốc không?',
    answer:
      'Có, đội ngũ dược sĩ của chúng tôi luôn sẵn sàng tư vấn miễn phí về cách sử dụng thuốc, liều lượng và các lưu ý khi dùng thuốc. Bạn có thể gọi hotline hoặc chat trực tiếp để được hỗ trợ.',
  },
  {
    question: 'Chính sách đổi trả như thế nào?',
    answer:
      'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên seal, không bị hư hỏng. Đối với thuốc bảo quản đặc biệt hoặc thuốc kê đơn đã mở, không áp dụng đổi trả.',
  },
  {
    question: 'Có thể mua thuốc kê đơn không?',
    answer:
      'Thuốc kê đơn chỉ được bán khi có đơn thuốc hợp lệ từ bác sĩ. Bạn có thể gửi ảnh đơn thuốc qua Zalo/Messenger hoặc mang đơn trực tiếp đến nhà thuốc để mua.',
  },
];

export default function FAQSection() {
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Câu Hỏi <span className="text-adk-green">Thường Gặp</span>
            </h2>
            <p className="text-lg text-gray-600">
              Giải đáp các thắc mắc phổ biến của khách hàng
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
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg mb-3 px-6 border-none shadow-sm"
                >
                  <AccordionTrigger className="text-left hover:no-underline hover:text-adk-green">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
