import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container-full">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="ADK Logo"
                  className="w-10 h-10 object-contain rounded-full"
                />
              </div>
              <span className="text-xl font-bold text-white">Nhà Thuốc ADK</span>
            </div>
            <p className="text-gray-400 mb-4">
              Nhà thuốc uy tín hàng đầu Việt Nam với hơn 10 năm kinh nghiệm trong
              lĩnh vực chăm sóc sức khỏe.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-adk-green" />
                <a href="tel:1900xxxx" className="hover:text-adk-green transition-colors">
                  1900 xxxx
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-adk-green" />
                <a href="mailto:info@adk.vn" className="hover:text-adk-green transition-colors">
                  info@adk.vn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-adk-green flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-adk-green transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-adk-green transition-colors">
                  Chính Sách Bảo Mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-adk-green transition-colors">
                  Điều Khoản Sử Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-adk-green transition-colors">
                  Hỏi Đáp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nhà Thuốc ADK. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}
