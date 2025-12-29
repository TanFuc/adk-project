import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { HoiDapHopTac } from "@/types";

// B2B Partnership FAQs - Fallback when no dynamic data
const defaultFaqs = [
  {
    question: "Toi can bao nhieu von de bat dau?",
    answer:
      "Von dau tu linh hoat tu 500 trieu - 2 ty dong tuy theo quy mo mat bang (40-100m2). Lien he de nhan bang du toan chi tiet phu hop voi dieu kien cua ban.",
  },
  {
    question: "ADK ho tro nguon hang nhu the nao?",
    answer:
      "Cung cap danh muc san pham chuan hoa gom Thuoc, TPCN, Thuc pham sach va OCOP. Gia tot nhat tu kho tong, giao hang dinh ky, ho tro doi tra hang cham luan chuyen.",
  },
  {
    question: "Toi co duoc dao tao nhan su khong?",
    answer:
      "Co. ADK dao tao toan dien cho duoc si va nhan vien ve: Ky nang ban le, Tu van dinh duong, Su dung he thong ERP, va Quy trinh van hanh chuan GPP.",
  },
  {
    question: "Thoi gian hoan von du kien la bao lau?",
    answer:
      "Voi vi tri tot va van hanh dung quy trinh, thoi gian hoan von trung binh tu 18-24 thang. Doanh thu trung binh tu 300-500 trieu/thang tuy quy mo.",
  },
  {
    question: "ADK ho tro marketing nhu the nao?",
    answer:
      "Ho tro marketing da kenh: Fanpage chung, SEO dia phuong, Chuong trinh khuyen mai toan he thong, Tai lieu truyen thong san co. Chi phi marketing duoc chia se trong he thong.",
  },
  {
    question: "Quy trinh hop tac nhu the nao?",
    answer:
      "Quy trinh 5 buoc: (1) Dang ky tu van - (2) Khao sat mat bang - (3) Ky hop dong - (4) Setup cua hang (30-45 ngay) - (5) Khai truong va van hanh.",
  },
];

interface FAQSectionProps {
  faqs?: HoiDapHopTac[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  // Use dynamic data if available, otherwise use defaults
  const displayFaqs = faqs && faqs.length > 0
    ? faqs.map((faq) => ({ question: faq.cauHoi, answer: faq.traLoi }))
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
