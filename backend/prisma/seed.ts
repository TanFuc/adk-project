import { PrismaClient, LoaiBoCuc, LoaiNoiDung } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== B2B ADK Project Seed Data ===');
  console.log('Xoá dữ liệu cũ B2C...');

  // Clear all existing data
  await prisma.noiDung.deleteMany();
  await prisma.phanMuc.deleteMany();
  await prisma.bannerPopup.deleteMany();
  await prisma.suKien.deleteMany();
  await prisma.cauHinh.deleteMany();

  // 1. Global Settings - Cấu hình hệ thống B2B
  console.log('Tạo cấu hình hệ thống B2B...');
  const settings = [
    {
      key: 'primary_register_url',
      value: { url: 'https://bizmall.vn' },
      moTa: 'URL đăng ký hợp tác (redirect CTA)',
    },
    {
      key: 'site_name',
      value: {
        name: 'Dự Án Phát Triển Chuỗi Nhà Thuốc ADK',
        shortName: 'ADK Franchise',
        tagline: 'Mô hình Siêu thị Thuốc & Thực phẩm sạch - Xu hướng 2025'
      },
      moTa: 'Thông tin dự án',
    },
    {
      key: 'contact_info',
      value: {
        hotline: '1800-1234',
        email: 'partnership@adkpharma.vn',
        address: 'Trụ sở: Số 123, Đường ABC, Quận XYZ, TP.HCM',
      },
      moTa: 'Thông tin liên hệ B2B',
    },
    {
      key: 'social_links',
      value: {
        facebook: 'https://facebook.com/adkpharma',
        zalo: 'https://zalo.me/adkpharma',
        youtube: 'https://youtube.com/@adkpharma',
      },
      moTa: 'Liên kết mạng xã hội',
    },
  ];

  for (const setting of settings) {
    await prisma.cauHinh.upsert({
      where: { key: setting.key },
      update: { value: setting.value, moTa: setting.moTa },
      create: setting,
    });
  }

  // 2. Popup Banner - B2B Lead Capture
  console.log('Tạo banner popup B2B...');
  await prisma.bannerPopup.create({
    data: {
      hinhAnh: '/images/popup/partner-opportunity.jpg',
      duongDan: 'https://bizmall.vn',
      hoatDong: true,
      doTreHienThi: 5000,
      thuTuUuTien: 0,
    },
  });

  // 3. Investment Events - Sự kiện đầu tư
  console.log('Tạo sự kiện đầu tư B2B...');
  const events = [
    {
      tieuDe: 'Hội Thảo Đầu Tư Nhượng Quyền ADK 2025',
      moTa: 'Cơ hội vàng trở thành đối tác chiến lược của chuỗi Siêu Thị Thuốc ADK. Tìm hiểu mô hình kinh doanh, ROI dự kiến và quy trình hợp tác.',
      ngayBatDau: new Date('2025-02-15T08:00:00Z'),
      ngayKetThuc: new Date('2025-02-15T17:00:00Z'),
      anhBia: '/images/events/investment-seminar.jpg',
      boSuuTapAnh: [
        '/images/events/seminar-1.jpg',
        '/images/events/seminar-2.jpg',
      ],
      noiDung: {
        highlights: [
          'Phân tích thị trường ngành dược phẩm 2025',
          'Mô hình lợi nhuận từ Thuốc + Thực phẩm sạch',
          'Gặp gỡ đội ngũ lãnh đạo ADK',
          'Ký kết hợp tác tại chỗ - Ưu đãi đặc biệt',
        ],
        location: 'Khách sạn Rex - Quận 1, TP.HCM',
        targetAudience: 'Nhà đầu tư, Dược sĩ, Chủ nhà thuốc',
      },
      noiBat: true,
      hienThi: true,
    },
    {
      tieuDe: 'Lễ Ký Kết Đối Tác Chiến Lược Quý I/2025',
      moTa: 'Sự kiện chào mừng các đối tác mới gia nhập hệ thống ADK. Chia sẻ kinh nghiệm từ các nhà thuốc đã thành công.',
      ngayBatDau: new Date('2025-03-01T09:00:00Z'),
      ngayKetThuc: new Date('2025-03-01T12:00:00Z'),
      anhBia: '/images/events/partner-signing.jpg',
      boSuuTapAnh: [],
      noiDung: {
        highlights: [
          'Chia sẻ từ đối tác thành công',
          'Trao bảng nhận diện thương hiệu',
          'Hỗ trợ setup cửa hàng từ A-Z',
        ],
        location: 'Trụ sở ADK - TP.HCM',
      },
      noiBat: true,
      hienThi: true,
    },
    {
      tieuDe: 'Workshop: Vận Hành Nhà Thuốc Hiện Đại',
      moTa: 'Đào tạo chuyên sâu về quy trình vận hành, quản lý tồn kho, và ứng dụng công nghệ trong nhà thuốc.',
      ngayBatDau: new Date('2025-03-15T08:00:00Z'),
      ngayKetThuc: new Date('2025-03-15T17:00:00Z'),
      anhBia: '/images/events/workshop-operation.jpg',
      boSuuTapAnh: [],
      noiDung: {
        topics: [
          'Hệ thống ERP quản lý nhà thuốc',
          'Tối ưu hóa tồn kho và nguồn hàng',
          'Marketing đa kênh cho nhà thuốc',
          'Kỹ năng tư vấn bán hàng chuyên nghiệp',
        ],
      },
      noiBat: false,
      hienThi: true,
    },
  ];

  for (const event of events) {
    await prisma.suKien.create({ data: event });
  }

  // 4. Page Sections - B2B Focused Content
  console.log('Tạo nội dung trang B2B...');
  const sections = [
    {
      key: 'hero_main',
      loaiBoCuc: LoaiBoCuc.HERO_IMAGE,
      noiDung: {
        title: 'DỰ ÁN PHÁT TRIỂN CHUỖI NHÀ THUỐC ADK',
        subtitle: 'Mô hình Siêu thị Thuốc & Thực phẩm sạch - Xu hướng kinh doanh bền vững 2025.',
        ctaText: 'Đăng Ký Hợp Tác Ngay',
        stats: [
          { value: '10+', label: 'Năm kinh nghiệm' },
          { value: '100+', label: 'Đối tác' },
          { value: '2025', label: 'Xu hướng mới' },
        ],
      },
      hinhAnh: ['/images/hero/b2b-hero.jpg'],
      ctaLink: 'https://bizmall.vn',
      thuTu: 0,
      hienThi: true,
    },
    {
      key: 'market_insight',
      loaiBoCuc: LoaiBoCuc.TEXT_ONLY,
      noiDung: {
        title: 'Nắm Bắt Xu Hướng Tương Lai',
        subtitle: 'Thị trường 2025',
        description: 'Năm 2025, người tiêu dùng chuyển dịch từ "Chữa bệnh" sang "Chăm sóc sức khỏe chủ động". Mô hình ADK giải quyết bài toán này bằng sự kết hợp hoàn hảo giữa Nhà thuốc GPP và Siêu thị thực phẩm sạch.',
        keyPoints: [
          'Tăng trưởng ngành dược phẩm 8-10%/năm',
          'Xu hướng Healthy Living lan rộng',
          'Người tiêu dùng ưu tiên nguồn gốc rõ ràng',
        ],
      },
      hinhAnh: [],
      thuTu: 1,
      hienThi: true,
    },
    {
      key: 'adk_model',
      loaiBoCuc: LoaiBoCuc.SPLIT_IMAGE_TEXT,
      noiDung: {
        title: 'Mô Hình ADK',
        subtitle: 'Giao thoa Y Học & Dinh Dưỡng',
        leftColumn: {
          title: 'Nhà Thuốc GPP Hiện Đại',
          items: ['Thuốc kê đơn & OTC', 'Thực phẩm chức năng', 'Dược mỹ phẩm chính hãng'],
        },
        rightColumn: {
          title: 'Siêu Thị Tự Chọn',
          items: ['Sữa hạt, Sữa tươi hữu cơ', 'Thực phẩm Organic', 'Đặc sản OCOP các vùng miền'],
        },
        bottomText: 'Biến nhà thuốc truyền thống thành điểm đến Healthy Living Hub.',
      },
      hinhAnh: ['/images/model/pharmacy-side.jpg', '/images/model/supermarket-side.jpg'],
      thuTu: 2,
      hienThi: true,
    },
    {
      key: 'investment_benefits',
      loaiBoCuc: LoaiBoCuc.BENTO_GRID,
      noiDung: {
        title: 'Lợi Ích Đầu Tư',
        subtitle: 'Tại sao chọn ADK?',
        items: [
          {
            id: 'revenue',
            title: 'Đa Dạng Nguồn Thu',
            description: 'Tối ưu lợi nhuận từ thuốc và thực phẩm sạch. Không phụ thuộc một nguồn doanh thu.',
            icon: 'trending-up',
            size: 'large',
          },
          {
            id: 'automation',
            title: 'Vận Hành Tự Động',
            description: 'Hệ thống ERP, App quản lý, Hóa đơn điện tử tích hợp sẵn.',
            icon: 'cpu',
            size: 'medium',
          },
          {
            id: 'supply',
            title: 'Chuỗi Cung Ứng Chủ Động',
            description: 'Kết nối trực tiếp nhà máy & vùng nguyên liệu. Giá gốc, không qua trung gian.',
            icon: 'package',
            size: 'medium',
          },
          {
            id: 'support',
            title: 'Hỗ Trợ Toàn Diện',
            description: 'Tài trợ vốn, Setup cửa hàng từ A-Z, Marketing đa kênh.',
            icon: 'handshake',
            size: 'large',
          },
        ],
      },
      hinhAnh: [],
      thuTu: 3,
      hienThi: true,
    },
    {
      key: 'store_standards',
      loaiBoCuc: LoaiBoCuc.MASONRY_GRID,
      noiDung: {
        title: 'Tiêu Chuẩn Cửa Hàng ADK',
        subtitle: 'Thiết kế đồng bộ, chuyên nghiệp',
      },
      hinhAnh: [
        '/images/store/exterior-1.jpg',
        '/images/store/interior-1.jpg',
        '/images/store/pharmacy-counter.jpg',
        '/images/store/organic-section.jpg',
        '/images/store/checkout-area.jpg',
        '/images/store/signage.jpg',
      ],
      thuTu: 4,
      hienThi: true,
    },
    {
      key: 'cta_partnership',
      loaiBoCuc: LoaiBoCuc.CTA_BANNER,
      noiDung: {
        title: 'Cơ Hội Trở Thành Đối Tác Chiến Lược',
        subtitle: 'Đăng ký ngay để nhận tư vấn miễn phí và bảng dự toán chi tiết',
        ctaText: 'Đăng Ký Hợp Tác Ngay',
        secondaryText: 'Hotline tư vấn: 1800-1234',
      },
      hinhAnh: ['/images/cta/partnership-bg.jpg'],
      ctaLink: 'https://bizmall.vn',
      thuTu: 5,
      hienThi: true,
    },
  ];

  for (const section of sections) {
    await prisma.phanMuc.create({ data: section });
  }

  // 5. Partnership FAQs - B2B Q&A
  console.log('Tạo FAQ hợp tác B2B...');
  const partnerFaqs = [
    {
      loai: LoaiNoiDung.FAQ,
      tieuDe: 'Tôi cần bao nhiêu vốn để bắt đầu?',
      moTa: 'Vốn đầu tư linh hoạt từ 500 triệu - 2 tỷ đồng tùy theo quy mô mặt bằng (40-100m²). Liên hệ để nhận bảng dự toán chi tiết phù hợp với điều kiện của bạn.',
      noiDung: { category: 'investment' },
      thuTu: 0,
    },
    {
      loai: LoaiNoiDung.FAQ,
      tieuDe: 'ADK hỗ trợ nguồn hàng như thế nào?',
      moTa: 'Cung cấp danh mục sản phẩm chuẩn hóa gồm Thuốc, TPCN, Thực phẩm sạch và OCOP. Giá tốt nhất từ kho tổng, giao hàng định kỳ, hỗ trợ đổi trả hàng chậm luân chuyển.',
      noiDung: { category: 'supply' },
      thuTu: 1,
    },
    {
      loai: LoaiNoiDung.FAQ,
      tieuDe: 'Tôi có được đào tạo nhân sự không?',
      moTa: 'Có. ADK đào tạo toàn diện cho dược sĩ và nhân viên về: Kỹ năng bán lẻ, Tư vấn dinh dưỡng, Sử dụng hệ thống ERP, và Quy trình vận hành chuẩn GPP.',
      noiDung: { category: 'training' },
      thuTu: 2,
    },
    {
      loai: LoaiNoiDung.FAQ,
      tieuDe: 'Thời gian hoàn vốn dự kiến là bao lâu?',
      moTa: 'Với vị trí tốt và vận hành đúng quy trình, thời gian hoàn vốn trung bình từ 18-24 tháng. Doanh thu trung bình từ 300-500 triệu/tháng tùy quy mô.',
      noiDung: { category: 'roi' },
      thuTu: 3,
    },
    {
      loai: LoaiNoiDung.FAQ,
      tieuDe: 'ADK hỗ trợ marketing như thế nào?',
      moTa: 'Hỗ trợ marketing đa kênh: Fanpage chung, SEO địa phương, Chương trình khuyến mãi toàn hệ thống, Tài liệu truyền thông sẵn có. Chi phí marketing được chia sẻ trong hệ thống.',
      noiDung: { category: 'marketing' },
      thuTu: 4,
    },
    {
      loai: LoaiNoiDung.FAQ,
      tieuDe: 'Quy trình hợp tác như thế nào?',
      moTa: 'Quy trình 5 bước: (1) Đăng ký tư vấn → (2) Khảo sát mặt bằng → (3) Ký hợp đồng → (4) Setup cửa hàng (30-45 ngày) → (5) Khai trương và vận hành.',
      noiDung: { category: 'process' },
      thuTu: 5,
    },
  ];

  for (const faq of partnerFaqs) {
    await prisma.noiDung.create({ data: faq });
  }

  // 6. Investment Features - Lợi ích đầu tư (thay thế B2C features)
  console.log('Tạo features đầu tư B2B...');
  const investmentFeatures = [
    {
      loai: LoaiNoiDung.FEATURE,
      tieuDe: 'Đa Dạng Nguồn Thu',
      moTa: 'Tối ưu lợi nhuận từ thuốc GPP và thực phẩm sạch. Biên lợi nhuận gộp 25-40% tùy nhóm hàng.',
      noiDung: { icon: 'trending-up' },
      thuTu: 0,
    },
    {
      loai: LoaiNoiDung.FEATURE,
      tieuDe: 'Vận Hành Tự Động',
      moTa: 'Hệ thống ERP quản lý tồn kho, App bán hàng, Hóa đơn điện tử tích hợp sẵn. Tiết kiệm chi phí nhân sự.',
      noiDung: { icon: 'cpu' },
      thuTu: 1,
    },
    {
      loai: LoaiNoiDung.FEATURE,
      tieuDe: 'Chuỗi Cung Ứng Chủ Động',
      moTa: 'Kết nối trực tiếp nhà máy & vùng nguyên liệu. Giá gốc, không qua trung gian, giao hàng đúng hạn.',
      noiDung: { icon: 'package' },
      thuTu: 2,
    },
    {
      loai: LoaiNoiDung.FEATURE,
      tieuDe: 'Thương Hiệu Uy Tín',
      moTa: 'Hệ thống nhận diện thương hiệu đồng bộ, chuyên nghiệp. Được khách hàng tin tưởng.',
      noiDung: { icon: 'badge' },
      thuTu: 3,
    },
    {
      loai: LoaiNoiDung.FEATURE,
      tieuDe: 'Hỗ Trợ Vốn',
      moTa: 'Tài trợ vốn nhập hàng ban đầu, chi phí vận hành tháng đầu tiên. Giảm áp lực tài chính.',
      noiDung: { icon: 'wallet' },
      thuTu: 4,
    },
    {
      loai: LoaiNoiDung.FEATURE,
      tieuDe: 'Setup Trọn Gói',
      moTa: 'Thiết kế, thi công cửa hàng từ A-Z. Bàn giao trong 30-45 ngày, sẵn sàng kinh doanh.',
      noiDung: { icon: 'store' },
      thuTu: 5,
    },
  ];

  for (const feature of investmentFeatures) {
    await prisma.noiDung.create({ data: feature });
  }

  console.log('=== Seed B2B hoàn tất! ===');
}

main()
  .catch((e) => {
    console.error('Lỗi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
