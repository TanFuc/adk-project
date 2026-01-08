import { PrismaClient, LayoutType, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== B2B ADK Project Seed Data ===');
  console.log('Clearing existing data...');

  // Clear all existing data
  await prisma.content.deleteMany();
  await prisma.section.deleteMany();
  await prisma.bannerPopup.deleteMany();
  await prisma.event.deleteMany();
  await prisma.configuration.deleteMany();
  await prisma.businessModel.deleteMany();
  await prisma.partnershipFaq.deleteMany();

  // 1. Global Settings - System Configuration B2B
  console.log('Creating B2B system configuration...');
  const settings = [
    {
      key: 'primary_register_url',
      value: { url: 'https://bizmall.vn' },
      description: 'Partnership registration URL (CTA redirect)',
    },
    {
      key: 'site_name',
      value: {
        name: 'ADK Pharmacy Chain Development Project',
        shortName: 'ADK Franchise',
        tagline: 'Pharmacy & Health Food Supermarket Model - 2025 Trend',
      },
      description: 'Project information',
    },
    {
      key: 'contact_info',
      value: {
        hotline: '1800-1234',
        email: 'partnership@adkpharma.vn',
        address: 'HQ: 123 ABC Street, XYZ District, HCMC',
      },
      description: 'B2B contact information',
    },
    {
      key: 'social_links',
      value: {
        facebook: 'https://facebook.com/adkpharma',
        zalo: 'https://zalo.me/adkpharma',
        youtube: 'https://youtube.com/@adkpharma',
      },
      description: 'Social media links',
    },
  ];

  for (const setting of settings) {
    await prisma.configuration.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }

  // 2. Popup Banner - B2B Lead Capture
  console.log('Creating B2B popup banner...');
  await prisma.bannerPopup.create({
    data: {
      imageUrl: '/images/popup/partner-opportunity.jpg',
      redirectUrl: 'https://bizmall.vn',
      isActive: true,
      displayDelay: 5000,
      priority: 0,
    },
  });

  // 3. Investment Events
  console.log('Creating B2B investment events...');
  const events = [
    {
      title: 'ADK Franchise Investment Seminar 2025',
      description:
        'Golden opportunity to become a strategic partner of ADK Pharmacy Supermarket chain. Learn about business model, expected ROI and partnership process.',
      startDate: new Date('2025-02-15T08:00:00Z'),
      endDate: new Date('2025-02-15T17:00:00Z'),
      coverImage: '/images/events/investment-seminar.jpg',
      gallery: ['/images/events/seminar-1.jpg', '/images/events/seminar-2.jpg'],
      content: {
        highlights: [
          'Pharmaceutical industry market analysis 2025',
          'Profit model from Pharmacy + Health Food',
          'Meet ADK leadership team',
          'On-site partnership signing - Special offers',
        ],
        location: 'Rex Hotel - District 1, HCMC',
        targetAudience: 'Investors, Pharmacists, Pharmacy Owners',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Strategic Partner Signing Ceremony Q1/2025',
      description:
        'Event welcoming new partners joining the ADK system. Experience sharing from successful pharmacies.',
      startDate: new Date('2025-03-01T09:00:00Z'),
      endDate: new Date('2025-03-01T12:00:00Z'),
      coverImage: '/images/events/partner-signing.jpg',
      gallery: [],
      content: {
        highlights: [
          'Sharing from successful partners',
          'Brand identity board handover',
          'A-Z store setup support',
        ],
        location: 'ADK Headquarters - HCMC',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Workshop: Modern Pharmacy Operations',
      description:
        'In-depth training on operational processes, inventory management, and technology application in pharmacies.',
      startDate: new Date('2025-03-15T08:00:00Z'),
      endDate: new Date('2025-03-15T17:00:00Z'),
      coverImage: '/images/events/workshop-operation.jpg',
      gallery: [],
      content: {
        topics: [
          'ERP system for pharmacy management',
          'Inventory and supply optimization',
          'Omnichannel marketing for pharmacies',
          'Professional sales consulting skills',
        ],
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      tieuDe: 'Roadshow Tuyển Đối Tác Khu Vực Miền Bắc',
      moTa: 'Chuỗi sự kiện giới thiệu mô hình ADK tại Hà Nội, Hải Phòng, Quảng Ninh. Gặp gỡ đội ngũ chuyên gia tư vấn đầu tư.',
      ngayBatDau: new Date('2025-04-10T08:00:00Z'),
      ngayKetThuc: new Date('2025-04-12T17:00:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
      boSuuTapAnh: [
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      ],
      noiDung: {
        schedule: [
          '10/04: Hà Nội - Khách sạn Melia',
          '11/04: Hải Phòng - Trung tâm hội nghị',
          '12/04: Quảng Ninh - Vinpearl Hotel',
        ],
        benefits: 'Ưu đãi đặc biệt cho 10 đối tác đầu tiên tại mỗi địa điểm',
      },
      noiBat: true,
      hienThi: true,
    },
    {
      tieuDe: 'Triển Lãm Thiết Bị Y Tế & Dược Phẩm 2025',
      moTa: 'ADK tham gia triển lãm quốc tế với gian hàng giới thiệu mô hình Siêu Thị Thuốc hiện đại. Khách tham quan được trải nghiệm mô hình 3D.',
      ngayBatDau: new Date('2025-05-20T09:00:00Z'),
      ngayKetThuc: new Date('2025-05-23T18:00:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1200&q=80',
      boSuuTapAnh: [
        'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      ],
      noiDung: {
        location: 'SECC - Quận 7, TP.HCM',
        booth: 'Gian hàng A12-15',
        activities: [
          'Demo hệ thống ERP quản lý',
          'Tư vấn 1-1 với chuyên gia',
          'Quà tặng cho khách tham quan',
        ],
      },
      noiBat: false,
      hienThi: true,
    },
    {
      tieuDe: 'Chương Trình Đào Tạo Dược Sĩ Toàn Quốc',
      moTa: 'Khóa đào tạo chuyên sâu 3 ngày về vận hành nhà thuốc chuẩn GPP, kỹ năng tư vấn khách hàng và quản lý kinh doanh hiệu quả.',
      ngayBatDau: new Date('2025-06-05T08:00:00Z'),
      ngayKetThuc: new Date('2025-06-07T17:00:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
      boSuuTapAnh: [
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      ],
      noiDung: {
        modules: [
          'Ngày 1: Chuẩn GPP và quản lý chất lượng',
          'Ngày 2: Kỹ năng tư vấn và chăm sóc khách hàng',
          'Ngày 3: Quản lý tài chính và marketing',
        ],
        certification: 'Cấp chứng chỉ hoàn thành từ Hội Dược sĩ VN',
      },
      noiBat: false,
      hienThi: true,
    },
    {
      tieuDe: 'Lễ Trao Giải Đối Tác Xuất Sắc 2024',
      moTa: 'Vinh danh các nhà thuốc đạt doanh thu cao, phục vụ khách hàng tốt nhất. Tổng giá trị giải thưởng 500 triệu đồng.',
      ngayBatDau: new Date('2025-01-25T18:00:00Z'),
      ngayKetThuc: new Date('2025-01-25T22:00:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80',
      boSuuTapAnh: [
        'https://images.unsplash.com/photo-1519167758481-83f29b1fe609?w=800&q=80',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      ],
      noiDung: {
        awards: [
          'Top 10 Doanh Thu Cao Nhất: 50 triệu/cửa hàng',
          'Top 5 Khách Hàng Hài Lòng: 30 triệu/cửa hàng',
          'Top 3 Phát Triển Nhanh: 70 triệu/cửa hàng',
        ],
        gala: 'Tiệc gala tại khách sạn 5 sao',
      },
      noiBat: true,
      hienThi: true,
    },
    {
      tieuDe: 'Hội Nghị Kickoff Quý II/2025',
      moTa: 'Công bố chiến lược kinh doanh quý 2, ra mắt sản phẩm mới và chương trình khuyến mãi hấp dẫn dành cho đối tác.',
      ngayBatDau: new Date('2025-04-01T08:30:00Z'),
      ngayKetThuc: new Date('2025-04-01T16:00:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80',
      boSuuTapAnh: [],
      noiDung: {
        agenda: [
          '08:30 - Đón tiếp & check-in',
          '09:00 - Báo cáo kết quả Quý I',
          '10:30 - Ra mắt sản phẩm mới',
          '14:00 - Chương trình khuyến mãi Q2',
          '15:30 - Giao lưu networking',
        ],
      },
      noiBat: false,
      hienThi: true,
    },
    {
      tieuDe: 'Ngày Hội Sức Khỏe Cộng Đồng',
      moTa: 'Sự kiện khám sức khỏe miễn phí do ADK tổ chức, nhằm tăng nhận diện thương hiệu và kết nối với cộng đồng địa phương.',
      ngayBatDau: new Date('2025-07-15T07:00:00Z'),
      ngayKetThuc: new Date('2025-07-15T17:00:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
      boSuuTapAnh: [
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
      ],
      noiDung: {
        services: [
          'Đo huyết áp, đường huyết miễn phí',
          'Tư vấn dinh dưỡng từ chuyên gia',
          'Tặng quà sức khỏe cho 500 khách đầu tiên',
          'Ưu đãi 20% sản phẩm tại sự kiện',
        ],
        location: 'Công viên Lê Văn Tám, Quận 1',
      },
      noiBat: false,
      hienThi: true,
    },
    {
      tieuDe: 'Seminar Xu Hướng Healthy Living 2025',
      moTa: 'Hội thảo chuyên đề về xu hướng chăm sóc sức khỏe toàn diện, từ thuốc điều trị đến dinh dưỡng phòng ngừa.',
      ngayBatDau: new Date('2025-08-20T14:00:00Z'),
      ngayKetThuc: new Date('2025-08-20T17:30:00Z'),
      anhBia: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
      boSuuTapAnh: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80'],
      noiDung: {
        speakers: [
          'TS. Nguyễn Văn A - Chuyên gia Dinh dưỡng',
          'DS. Trần Thị B - Giám đốc Y khoa ADK',
          'CEO Lê Văn C - Founder ADK Pharma',
        ],
        topics: [
          'Thực phẩm chức năng: Lựa chọn thông minh',
          'Chế độ ăn cho người bệnh mãn tính',
          'Tích hợp Y học hiện đại và Y học cổ truyền',
        ],
      },
      noiBat: true,
      hienThi: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // 4. Business Models
  console.log('Creating B2B business models...');
  const businessModels = [
    {
      name: 'Diverse Revenue Streams',
      description:
        'Optimize profits from GPP pharmacy and health food. Gross profit margin 25-40% depending on product category. Not dependent on a single revenue source.',
      iconUrl: '/images/icons/revenue.svg',
      profitPotential: '25-40%',
      sortOrder: 0,
      isVisible: true,
    },
    {
      name: 'Automated Operations',
      description:
        'Integrated ERP inventory management, sales app, and e-invoicing. Save on staffing costs and operational time.',
      iconUrl: '/images/icons/automation.svg',
      profitPotential: 'Save 30%',
      sortOrder: 1,
      isVisible: true,
    },
    {
      name: 'Proactive Supply Chain',
      description:
        'Direct connection to factories & ingredient sources. Factory prices, no middlemen, on-time delivery. Support for slow-moving inventory returns.',
      iconUrl: '/images/icons/supply-chain.svg',
      profitPotential: 'Best prices',
      sortOrder: 2,
      isVisible: true,
    },
    {
      name: 'Trusted Brand',
      description:
        'Unified, professional brand identity system. Trusted by customers with over 10 years in the industry.',
      iconUrl: '/images/icons/brand.svg',
      profitPotential: '10+ years trust',
      sortOrder: 3,
      isVisible: true,
    },
    {
      name: 'Capital Support',
      description:
        'Initial inventory funding, first month operating costs covered. Reduce financial pressure for new partners.',
      iconUrl: '/images/icons/funding.svg',
      profitPotential: '50% support',
      sortOrder: 4,
      isVisible: true,
    },
    {
      name: 'Turnkey Setup',
      description:
        'Store design and construction from A-Z. Handover in 30-45 days, ready to operate upon opening.',
      iconUrl: '/images/icons/setup.svg',
      profitPotential: '30-45 days',
      sortOrder: 5,
      isVisible: true,
    },
  ];

  for (const model of businessModels) {
    await prisma.businessModel.create({ data: model });
  }

  // 5. Partnership FAQs
  console.log('Creating B2B partnership FAQs...');
  const partnershipFaqs = [
    {
      question: 'How much capital do I need to start?',
      answer:
        'Flexible investment from 500 million - 2 billion VND depending on premises size (40-100m²). Contact us for a detailed estimate tailored to your conditions.',
      sortOrder: 0,
      isVisible: true,
    },
    {
      question: 'How does ADK support product supply?',
      answer:
        'Standardized product catalog including medicines, supplements, health food and OCOP products. Best prices from central warehouse, regular delivery, slow-moving inventory return support.',
      sortOrder: 1,
      isVisible: true,
    },
    {
      question: 'Will I receive staff training?',
      answer:
        'Yes. ADK provides comprehensive training for pharmacists and staff on: Retail skills, Nutrition consulting, ERP system usage, and GPP standard operating procedures.',
      sortOrder: 2,
      isVisible: true,
    },
    {
      question: 'What is the expected payback period?',
      answer:
        'With a good location and proper operations, average payback period is 18-24 months. Average monthly revenue 300-500 million VND depending on scale.',
      sortOrder: 3,
      isVisible: true,
    },
    {
      question: 'How does ADK support marketing?',
      answer:
        'Omnichannel marketing support: Shared fanpage, local SEO, system-wide promotions, ready-made marketing materials. Marketing costs shared across the system.',
      sortOrder: 4,
      isVisible: true,
    },
    {
      question: 'What is the partnership process?',
      answer:
        '5-step process: (1) Register for consultation → (2) Site survey → (3) Sign contract → (4) Store setup (30-45 days) → (5) Grand opening and operations.',
      sortOrder: 5,
      isVisible: true,
    },
    {
      cauHoi: 'Tôi không có kinh nghiệm kinh doanh nhà thuốc, có thể tham gia được không?',
      traLoi:
        'Hoàn toàn được! ADK hỗ trợ toàn diện từ A-Z, kể cả với người mới bắt đầu. Chúng tôi có đội ngũ chuyên gia hỗ trợ setup, đào tạo và vận hành. Điều kiện duy nhất là bạn cần có hoặc thuê dược sĩ đại diện.',
      thuTu: 6,
      hienThi: true,
    },
    {
      cauHoi: 'Diện tích mặt bằng tối thiểu là bao nhiêu?',
      traLoi:
        'Diện tích tối thiểu 40m² cho mô hình cơ bản. Mô hình tiêu chuẩn từ 60-80m², mô hình mở rộng từ 100m² trở lên. ADK hỗ trợ tư vấn thiết kế tối ưu dựa trên mặt bằng thực tế của bạn.',
      thuTu: 7,
      hienThi: true,
    },
    {
      cauHoi: 'Có cần giấy phép gì để mở nhà thuốc không?',
      traLoi:
        'Cần Giấy chứng nhận đủ điều kiện kinh doanh dược (GPP) do Sở Y tế cấp. ADK hỗ trợ toàn bộ hồ sơ, thủ tục pháp lý và đồng hành trong quá trình xin giấy phép.',
      thuTu: 8,
      hienThi: true,
    },
    {
      cauHoi: 'Phí nhượng quyền và phí quản lý hàng tháng là bao nhiêu?',
      traLoi:
        'Phí nhượng quyền ban đầu: 50-100 triệu đồng (một lần). Phí quản lý hệ thống: 2-3% doanh thu/tháng, bao gồm: ERP, marketing, đào tạo, hỗ trợ vận hành.',
      thuTu: 9,
      hienThi: true,
    },
    {
      cauHoi: 'Tôi có được quyền chọn nhà cung cấp riêng không?',
      traLoi:
        'Bạn được quyền nhập thêm sản phẩm từ nhà cung cấp riêng, nhưng phải đảm bảo chất lượng và nguồn gốc rõ ràng. Tuy nhiên, nhập từ kho ADK sẽ có giá tốt hơn và được hỗ trợ marketing.',
      thuTu: 10,
      hienThi: true,
    },
    {
      cauHoi: 'ADK có hỗ trợ tìm mặt bằng không?',
      traLoi:
        'Có. Đội ngũ ADK có kinh nghiệm tư vấn vị trí kinh doanh, phân tích thị trường địa phương và kết nối với các chủ mặt bằng tiềm năng tại khu vực bạn quan tâm.',
      thuTu: 11,
      hienThi: true,
    },
    {
      cauHoi: 'Nếu kinh doanh không hiệu quả, tôi có được hỗ trợ gì?',
      traLoi:
        'ADK cam kết đồng hành lâu dài. Nếu gặp khó khăn, chúng tôi sẽ: (1) Phân tích nguyên nhân, (2) Điều chỉnh chiến lược marketing, (3) Hỗ trợ tư vấn vận hành, (4) Tổ chức chương trình khuyến mãi kích cầu.',
      thuTu: 12,
      hienThi: true,
    },
    {
      cauHoi: 'Thời hạn hợp đồng hợp tác là bao lâu?',
      traLoi:
        'Hợp đồng nhượng quyền thời hạn 5 năm, có thể gia hạn. Trong thời gian hợp đồng, đối tác được hưởng đầy đủ quyền lợi và hỗ trợ từ ADK.',
      thuTu: 13,
      hienThi: true,
    },
    {
      cauHoi: 'Tôi có thể mở nhiều cửa hàng không?',
      traLoi:
        'Có. Sau khi cửa hàng đầu tiên vận hành ổn định (6-12 tháng), ADK khuyến khích mở rộng thêm cửa hàng với ưu đãi phí nhượng quyền và hỗ trợ vốn cho cửa hàng thứ 2, thứ 3.',
      thuTu: 14,
      hienThi: true,
    },
  ];

  for (const faq of partnershipFaqs) {
    await prisma.partnershipFaq.create({ data: faq });
  }

  // 6. Page Sections - B2B Focused Content
  console.log('Creating B2B page sections...');
  const sections = [
    {
      key: 'hero_main',
      layoutType: LayoutType.HERO_IMAGE,
      content: {
        title: 'ADK PHARMACY CHAIN DEVELOPMENT PROJECT',
        subtitle: 'Pharmacy & Health Food Supermarket Model - Sustainable Business Trend 2025.',
        ctaText: 'Register Partnership Now',
        stats: [
          { value: '10+', label: 'Years experience' },
          { value: '100+', label: 'Partners' },
          { value: '2025', label: 'New trend' },
        ],
      },
      images: ['/images/hero/b2b-hero.jpg'],
      ctaLink: 'https://bizmall.vn',
      sortOrder: 0,
      isVisible: true,
    },
    {
      key: 'market_insight',
      layoutType: LayoutType.TEXT_ONLY,
      content: {
        title: 'Capture Future Trends',
        subtitle: 'Market 2025',
        description:
          'In 2025, consumers shift from "Treatment" to "Proactive Healthcare". The ADK model solves this with a perfect combination of GPP Pharmacy and Health Food Supermarket.',
        keyPoints: [
          'Pharmaceutical industry growth 8-10%/year',
          'Healthy Living trend spreading',
          'Consumers prioritize clear origin',
        ],
      },
      images: [],
      sortOrder: 1,
      isVisible: true,
    },
    {
      key: 'adk_model',
      layoutType: LayoutType.SPLIT_IMAGE_TEXT,
      content: {
        title: 'The ADK Model',
        subtitle: 'Intersection of Medicine & Nutrition',
        leftColumn: {
          title: 'Modern GPP Pharmacy',
          items: [
            'Prescription & OTC medicines',
            'Dietary supplements',
            'Authentic cosmeceuticals',
          ],
        },
        rightColumn: {
          title: 'Self-Service Supermarket',
          items: ['Plant milk, Organic fresh milk', 'Organic food', 'Regional OCOP specialties'],
        },
        bottomText: 'Transform traditional pharmacy into a Healthy Living Hub destination.',
      },
      images: ['/images/model/pharmacy-side.jpg', '/images/model/supermarket-side.jpg'],
      sortOrder: 2,
      isVisible: true,
    },
    {
      key: 'investment_benefits',
      layoutType: LayoutType.BENTO_GRID,
      content: {
        title: 'Investment Benefits',
        subtitle: 'Why choose ADK?',
        items: [
          {
            id: 'revenue',
            title: 'Diverse Revenue Streams',
            description:
              'Optimize profits from pharmacy and health food. Not dependent on single revenue source.',
            icon: 'trending-up',
            size: 'large',
          },
          {
            id: 'automation',
            title: 'Automated Operations',
            description: 'Integrated ERP system, Management app, E-invoicing.',
            icon: 'cpu',
            size: 'medium',
          },
          {
            id: 'supply',
            title: 'Proactive Supply Chain',
            description:
              'Direct connection to factories & ingredient sources. Factory prices, no middlemen.',
            icon: 'package',
            size: 'medium',
          },
          {
            id: 'support',
            title: 'Comprehensive Support',
            description: 'Capital funding, A-Z store setup, Omnichannel marketing.',
            icon: 'handshake',
            size: 'large',
          },
        ],
      },
      images: [],
      sortOrder: 3,
      isVisible: true,
    },
    {
      key: 'store_standards',
      layoutType: LayoutType.MASONRY_GRID,
      content: {
        title: 'ADK Store Standards',
        subtitle: 'Unified, professional design',
      },
      images: [
        '/images/store/exterior-1.jpg',
        '/images/store/interior-1.jpg',
        '/images/store/pharmacy-counter.jpg',
        '/images/store/organic-section.jpg',
        '/images/store/checkout-area.jpg',
        '/images/store/signage.jpg',
      ],
      sortOrder: 4,
      isVisible: true,
    },
    {
      key: 'cta_partnership',
      layoutType: LayoutType.CTA_BANNER,
      content: {
        title: 'Opportunity to Become a Strategic Partner',
        subtitle: 'Register now for free consultation and detailed estimate',
        ctaText: 'Register Partnership Now',
        secondaryText: 'Consultation hotline: 1800-1234',
      },
      images: ['/images/cta/partnership-bg.jpg'],
      ctaLink: 'https://bizmall.vn',
      sortOrder: 5,
      isVisible: true,
    },
    {
      key: 'success_stories',
      loaiBoCuc: LoaiBoCuc.CAROUSEL,
      noiDung: {
        title: 'Câu Chuyện Thành Công',
        subtitle: 'Từ đối tác của chúng tôi',
        cards: [
          {
            id: 1,
            name: 'Dược Sĩ Nguyễn Thị Mai',
            location: 'ADK Pharmacy Bình Thạnh',
            story:
              'Từ nhà thuốc 40m² đến chuỗi 3 cửa hàng trong 2 năm. Doanh thu tháng đạt 450 triệu.',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
            revenue: '450 triệu/tháng',
          },
          {
            id: 2,
            name: 'Ông Trần Văn Hùng',
            location: 'ADK Healthy Hub Đà Nẵng',
            story:
              'Chuyển đổi từ tạp hóa sang mô hình ADK. Thu nhập tăng gấp 3 lần, phục vụ 200+ khách/ngày.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
            revenue: '320 triệu/tháng',
          },
          {
            id: 3,
            name: 'Chị Phạm Thu Hương',
            location: 'ADK Fresh Mart Hà Nội',
            story: 'Hoàn vốn sau 18 tháng. Khách hàng trung thành đến từ cả khu vực lân cận.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
            revenue: '280 triệu/tháng',
          },
        ],
      },
      hinhAnh: [],
      thuTu: 6,
      hienThi: true,
    },
    {
      key: 'roadmap_partnership',
      loaiBoCuc: LoaiBoCuc.TEXT_ONLY,
      noiDung: {
        title: 'Lộ Trình Hợp Tác',
        subtitle: 'Từ ý tưởng đến khai trương',
        steps: [
          {
            phase: 'Tuần 1-2',
            title: 'Tư Vấn & Khảo Sát',
            description: 'Gặp gỡ chuyên gia, khảo sát mặt bằng, phân tích thị trường địa phương',
          },
          {
            phase: 'Tuần 3',
            title: 'Ký Kết Hợp Đồng',
            description: 'Thống nhất điều khoản, ký hợp đồng nhượng quyền, thanh toán phí ban đầu',
          },
          {
            phase: 'Tuần 4-5',
            title: 'Thiết Kế & Chuẩn Bị',
            description: 'Thiết kế cửa hàng 3D, xin giấy phép, đặt hàng thiết bị và sản phẩm',
          },
          {
            phase: 'Tuần 6-9',
            title: 'Thi Công & Setup',
            description: 'Thi công cửa hàng, lắp đặt thiết bị, cài đặt hệ thống ERP',
          },
          {
            phase: 'Tuần 10',
            title: 'Đào Tạo Nhân Sự',
            description: 'Đào tạo dược sĩ và nhân viên về sản phẩm, quy trình, hệ thống',
          },
          {
            phase: 'Tuần 11',
            title: 'Khai Trương',
            description: 'Sự kiện khai trương, chạy marketing, hỗ trợ vận hành tháng đầu',
          },
        ],
      },
      hinhAnh: [],
      thuTu: 7,
      hienThi: true,
    },
    {
      key: 'product_categories',
      loaiBoCuc: LoaiBoCuc.BENTO_GRID,
      noiDung: {
        title: 'Danh Mục Sản Phẩm Đa Dạng',
        subtitle: 'Hơn 5,000 SKU từ 200+ thương hiệu uy tín',
        features: [
          {
            icon: 'pill',
            title: 'Thuốc Kê Đơn & OTC',
            description: '2,000+ SKU từ các hãng dược hàng đầu',
            stat: '40%',
          },
          {
            icon: 'heart',
            title: 'Thực Phẩm Chức Năng',
            description: 'Vitamin, khoáng chất, thảo dược',
            stat: '25%',
          },
          {
            icon: 'droplet',
            title: 'Dược Mỹ Phẩm',
            description: 'Chăm sóc da, tóc từ thương hiệu Y khoa',
            stat: '15%',
          },
          {
            icon: 'leaf',
            title: 'Thực Phẩm Organic',
            description: 'Sữa hạt, ngũ cốc, thực phẩm sạch',
            stat: '10%',
          },
          {
            icon: 'baby',
            title: 'Mẹ & Bé',
            description: 'Sữa công thức, tã, đồ dùng cho bé',
            stat: '7%',
          },
          {
            icon: 'stethoscope',
            title: 'Thiết Bị Y Tế',
            description: 'Máy đo huyết áp, đường huyết, nhiệt kế',
            stat: '3%',
          },
        ],
      },
      hinhAnh: [],
      thuTu: 8,
      hienThi: true,
    },
    {
      key: 'technology_stack',
      loaiBoCuc: LoaiBoCuc.SPLIT_IMAGE_TEXT,
      noiDung: {
        title: 'Công Nghệ Vận Hành',
        subtitle: 'Hệ thống quản lý toàn diện',
        leftColumn: {
          title: 'Phần Mềm Quản Lý',
          items: [
            'ERP quản lý tồn kho real-time',
            'POS bán hàng tích hợp thanh toán',
            'App mobile cho nhân viên',
            'Hóa đơn điện tử tự động',
          ],
        },
        rightColumn: {
          title: 'Marketing & CRM',
          items: [
            'Tích hợp Zalo OA, Facebook',
            'SMS Marketing tự động',
            'Chương trình tích điểm khách hàng',
            'Báo cáo doanh thu theo thời gian thực',
          ],
        },
        bottomText: 'Tiết kiệm 30% thời gian vận hành nhờ tự động hóa',
      },
      hinhAnh: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      ],
      thuTu: 9,
      hienThi: true,
    },
    {
      key: 'support_team',
      loaiBoCuc: LoaiBoCuc.BENTO_GRID,
      noiDung: {
        title: 'Đội Ngũ Hỗ Trợ 24/7',
        subtitle: 'Luôn sẵn sàng đồng hành cùng bạn',
        items: [
          {
            id: 'tech',
            title: 'Hỗ Trợ Kỹ Thuật',
            description: 'Giải quyết sự cố hệ thống, phần mềm trong vòng 2 giờ',
            icon: 'headset',
            size: 'large',
          },
          {
            id: 'supply',
            title: 'Quản Lý Nguồn Hàng',
            description: 'Tư vấn nhập hàng, tối ưu tồn kho',
            icon: 'truck',
            size: 'medium',
          },
          {
            id: 'marketing',
            title: 'Chuyên Viên Marketing',
            description: 'Hỗ trợ chiến dịch, thiết kế content',
            icon: 'megaphone',
            size: 'medium',
          },
          {
            id: 'training',
            title: 'Đào Tạo Liên Tục',
            description: 'Workshop, webinar hàng tháng về sản phẩm mới',
            icon: 'book',
            size: 'large',
          },
        ],
      },
      hinhAnh: [],
      thuTu: 10,
      hienThi: true,
    },
  ];

  for (const section of sections) {
    await prisma.section.create({ data: section });
  }

  // 7. Content - B2B FAQ Content
  console.log('Creating B2B FAQ content...');
  const partnerFaqs = [
    {
      type: ContentType.FAQ,
      title: 'How much capital do I need to start?',
      description:
        'Flexible investment from 500 million - 2 billion VND depending on premises size (40-100m²). Contact us for a detailed estimate tailored to your conditions.',
      content: { category: 'investment' },
      sortOrder: 0,
    },
    {
      type: ContentType.FAQ,
      title: 'How does ADK support product supply?',
      description:
        'Standardized product catalog including medicines, supplements, health food and OCOP products. Best prices from central warehouse, regular delivery, slow-moving inventory return support.',
      content: { category: 'supply' },
      sortOrder: 1,
    },
    {
      type: ContentType.FAQ,
      title: 'Will I receive staff training?',
      description:
        'Yes. ADK provides comprehensive training for pharmacists and staff on: Retail skills, Nutrition consulting, ERP system usage, and GPP standard operating procedures.',
      content: { category: 'training' },
      sortOrder: 2,
    },
    {
      type: ContentType.FAQ,
      title: 'What is the expected payback period?',
      description:
        'With a good location and proper operations, average payback period is 18-24 months. Average monthly revenue 300-500 million VND depending on scale.',
      content: { category: 'roi' },
      sortOrder: 3,
    },
    {
      type: ContentType.FAQ,
      title: 'How does ADK support marketing?',
      description:
        'Omnichannel marketing support: Shared fanpage, local SEO, system-wide promotions, ready-made marketing materials. Marketing costs shared across the system.',
      content: { category: 'marketing' },
      sortOrder: 4,
    },
    {
      type: ContentType.FAQ,
      title: 'What is the partnership process?',
      description:
        '5-step process: (1) Register for consultation → (2) Site survey → (3) Sign contract → (4) Store setup (30-45 days) → (5) Grand opening and operations.',
      content: { category: 'process' },
      sortOrder: 5,
    },
  ];

  for (const faq of partnerFaqs) {
    await prisma.content.create({ data: faq });
  }

  // 8. Investment Features - B2B Features Content
  console.log('Creating B2B investment features...');
  const investmentFeatures = [
    {
      type: ContentType.FEATURE,
      title: 'Diverse Revenue Streams',
      description:
        'Optimize profits from GPP pharmacy and health food. Gross profit margin 25-40% depending on product category.',
      content: { icon: 'trending-up' },
      sortOrder: 0,
    },
    {
      type: ContentType.FEATURE,
      title: 'Automated Operations',
      description:
        'Integrated ERP inventory management, sales app, and e-invoicing. Save on staffing costs.',
      content: { icon: 'cpu' },
      sortOrder: 1,
    },
    {
      type: ContentType.FEATURE,
      title: 'Proactive Supply Chain',
      description:
        'Direct connection to factories & ingredient sources. Factory prices, no middlemen, on-time delivery.',
      content: { icon: 'package' },
      sortOrder: 2,
    },
    {
      type: ContentType.FEATURE,
      title: 'Trusted Brand',
      description: 'Unified, professional brand identity system. Trusted by customers.',
      content: { icon: 'badge' },
      sortOrder: 3,
    },
    {
      type: ContentType.FEATURE,
      title: 'Capital Support',
      description:
        'Initial inventory funding, first month operating costs covered. Reduce financial pressure.',
      content: { icon: 'wallet' },
      sortOrder: 4,
    },
    {
      type: ContentType.FEATURE,
      title: 'Turnkey Setup',
      description:
        'Store design and construction from A-Z. Handover in 30-45 days, ready to operate.',
      content: { icon: 'store' },
      sortOrder: 5,
    },
  ];

  for (const feature of investmentFeatures) {
    await prisma.content.create({ data: feature });
  }

  // 9. Admin Users
  console.log('Creating admin users...');

  // Helper function to hash password (same as AuthService)
  function hashPassword(password: string): string {
    const { randomBytes, scryptSync } = require('crypto');
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  // Clear existing admins first
  await prisma.adminUser.deleteMany();

  const adminUsers = [
    {
      email: 'admin@adkpharma.vn',
      password: hashPassword('Admin@2025'),
      fullName: 'Super Admin ADK',
      role: 'SUPER_ADMIN' as const,
      isActive: true,
    },
    {
      email: 'manager@adkpharma.vn',
      password: hashPassword('Manager@2025'),
      fullName: 'System Manager',
      role: 'ADMIN' as const,
      isActive: true,
    },
    {
      email: 'support@adkpharma.vn',
      password: hashPassword('Support@2025'),
      fullName: 'Support Staff',
      role: 'ADMIN' as const,
      isActive: true,
    },
  ];

  for (const admin of adminUsers) {
    await prisma.adminUser.create({ data: admin });
    console.log(`  ✓ Created admin: ${admin.email}`);
  }

  console.log('\n=== B2B Seed Complete! ===');
  console.log('\n📋 Login Information:');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│ SUPER ADMIN                                         │');
  console.log('│ Email: admin@adkpharma.vn                          │');
  console.log('│ Password: Admin@2025                               │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log('│ ADMIN                                               │');
  console.log('│ Email: manager@adkpharma.vn                        │');
  console.log('│ Password: Manager@2025                             │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log('│ SUPPORT                                             │');
  console.log('│ Email: support@adkpharma.vn                        │');
  console.log('│ Password: Support@2025                             │');
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('\n⚠️  Please change password after first login!\n');
}

main()
  .catch(e => {
    console.error('Seed data error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
