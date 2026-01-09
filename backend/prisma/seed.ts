import { PrismaClient, LayoutType, ContentType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Seed Dữ Liệu B2B Dự Án ADK ===');
  console.log('Đang xóa dữ liệu hiện tại...');

  // Clear all existing data
  await prisma.photo.deleteMany();
  await prisma.photoCategory.deleteMany();
  await prisma.content.deleteMany();
  await prisma.section.deleteMany();
  await prisma.bannerPopup.deleteMany();
  await prisma.event.deleteMany();
  await prisma.configuration.deleteMany();
  await prisma.businessModel.deleteMany();
  await prisma.partnershipFaq.deleteMany();

  // 1. Global Settings - System Configuration B2B
  console.log('Đang tạo cấu hình hệ thống B2B...');
  const settings = [
    {
      key: 'primary_register_url',
      value: { url: 'https://bizmall.vn' },
      description: 'URL đăng ký hợp tác đối tác (chuyển hướng CTA)',
    },
    {
      key: 'site_name',
      value: {
        name: 'Dự Án Phát Triển Chuỗi Nhà Thuốc ADK',
        shortName: 'Nhượng Quyền ADK',
        tagline: 'Mô hình Siêu Thị Thuốc & Thực Phẩm Sức Khỏe - Xu hướng 2025',
      },
      description: 'Thông tin dự án',
    },
    {
      key: 'contact_info',
      value: {
        hotline: '1800-1234',
        email: 'hoptac@adkpharma.vn',
        address: 'Trụ sở chính: 123 Đường ABC, Quận XYZ, TP.HCM',
      },
      description: 'Thông tin liên hệ B2B',
    },
    {
      key: 'social_links',
      value: {
        facebook: 'https://facebook.com/adkpharma',
        zalo: 'https://zalo.me/adkpharma',
        youtube: 'https://youtube.com/@adkpharma',
      },
      description: 'Liên kết mạng xã hội',
    },
    {
      key: 'logo',
      value: {
        main: '/images/logo/adk-logo.png',
        light: '/images/logo/adk-logo-light.png',
        dark: '/images/logo/adk-logo-dark.png',
        favicon: '/images/logo/favicon.ico',
      },
      description: 'Cấu hình logo website',
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
  console.log('Đang tạo banner popup B2B...');
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
  console.log('Đang tạo sự kiện đầu tư B2B...');
  const events = [
    {
      title: 'Hội Thảo Đầu Tư Nhượng Quyền ADK 2025',
      description:
        'Cơ hội vàng để trở thành đối tác chiến lược của chuỗi Siêu Thị Thuốc ADK. Tìm hiểu mô hình kinh doanh, ROI dự kiến và quy trình hợp tác.',
      startDate: new Date('2025-02-15T08:00:00Z'),
      endDate: new Date('2025-02-15T17:00:00Z'),
      coverImage: '/images/events/investment-seminar.jpg',
      gallery: ['/images/events/seminar-1.jpg', '/images/events/seminar-2.jpg'],
      content: {
        highlights: [
          'Phân tích thị trường ngành Dược 2025',
          'Mô hình lợi nhuận từ Nhà Thuốc + Thực Phẩm Sức Khỏe',
          'Gặp gỡ Ban lãnh đạo ADK',
          'Ký kết hợp tác tại chỗ - Ưu đãi đặc biệt',
        ],
        location: 'Khách sạn Rex - Quận 1, TP.HCM',
        targetAudience: 'Nhà đầu tư, Dược sĩ, Chủ nhà thuốc',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Lễ Ký Kết Đối Tác Chiến Lược Q1/2025',
      description:
        'Sự kiện chào đón đối tác mới gia nhập hệ thống ADK. Chia sẻ kinh nghiệm từ các nhà thuốc thành công.',
      startDate: new Date('2025-03-01T09:00:00Z'),
      endDate: new Date('2025-03-01T12:00:00Z'),
      coverImage: '/images/events/partner-signing.jpg',
      gallery: [],
      content: {
        highlights: [
          'Chia sẻ từ đối tác thành công',
          'Bàn giao bộ nhận diện thương hiệu',
          'Hỗ trợ setup cửa hàng từ A-Z',
        ],
        location: 'Trụ sở ADK - TP.HCM',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Workshop: Vận Hành Nhà Thuốc Hiện Đại',
      description:
        'Đào tạo chuyên sâu về quy trình vận hành, quản lý tồn kho và ứng dụng công nghệ trong nhà thuốc.',
      startDate: new Date('2025-03-15T08:00:00Z'),
      endDate: new Date('2025-03-15T17:00:00Z'),
      coverImage: '/images/events/workshop-operation.jpg',
      gallery: [],
      content: {
        topics: [
          'Hệ thống ERP quản lý nhà thuốc',
          'Tối ưu hóa tồn kho và nguồn hàng',
          'Marketing đa kênh cho nhà thuốc',
          'Kỹ năng tư vấn bán hàng chuyên nghiệp',
        ],
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Roadshow Tuyển Đối Tác Miền Bắc',
      description:
        'Chuỗi sự kiện giới thiệu mô hình ADK tại Hà Nội, Hải Phòng, Quảng Ninh. Gặp gỡ chuyên gia tư vấn đầu tư.',
      startDate: new Date('2025-04-10T08:00:00Z'),
      endDate: new Date('2025-04-12T17:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      ],
      content: {
        schedule: [
          '10/4: Hà Nội - Khách sạn Melia',
          '11/4: Hải Phòng - Trung tâm Hội nghị',
          '12/4: Quảng Ninh - Khách sạn Vinpearl',
        ],
        benefits: 'Ưu đãi đặc biệt cho 10 đối tác đầu tiên mỗi địa điểm',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Triển Lãm Thiết Bị Y Tế & Dược Phẩm 2025',
      description:
        'ADK tham gia triển lãm quốc tế với gian hàng giới thiệu mô hình Siêu Thị Thuốc hiện đại. Khách tham quan có thể trải nghiệm mô hình 3D.',
      startDate: new Date('2025-05-20T09:00:00Z'),
      endDate: new Date('2025-05-23T18:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      ],
      content: {
        location: 'SECC - Quận 7, TP.HCM',
        booth: 'Gian hàng A12-15',
        activities: [
          'Demo hệ thống quản lý ERP',
          'Tư vấn 1-1 với chuyên gia',
          'Quà tặng cho khách tham quan',
        ],
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Chương Trình Đào Tạo Dược Sĩ Toàn Quốc',
      description:
        'Khóa học tập huấn chuyên sâu 3 ngày về vận hành nhà thuốc chuẩn GPP, kỹ năng tư vấn khách hàng và quản trị kinh doanh hiệu quả.',
      startDate: new Date('2025-06-05T08:00:00Z'),
      endDate: new Date('2025-06-07T17:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      ],
      content: {
        modules: [
          'Ngày 1: Tiêu chuẩn GPP và quản lý chất lượng',
          'Ngày 2: Kỹ năng tư vấn và chăm sóc khách hàng',
          'Ngày 3: Quản trị tài chính và marketing',
        ],
        certification: 'Chứng chỉ hoàn thành từ Hội Dược Sĩ Việt Nam',
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Lễ Vinh Danh Đối Tác Xuất Sắc 2024',
      description:
        'Tôn vinh các nhà thuốc có doanh thu cao nhất và dịch vụ khách hàng tốt nhất. Tổng giá trị giải thưởng 500 triệu đồng.',
      startDate: new Date('2025-01-25T18:00:00Z'),
      endDate: new Date('2025-01-25T22:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1519167758481-83f29b1fe609?w=800&q=80',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      ],
      content: {
        awards: [
          'Top 10 Doanh Thu Cao Nhất: 50 triệu/cửa hàng',
          'Top 5 Hài Lòng Khách Hàng: 30 triệu/cửa hàng',
          'Top 3 Tăng Trưởng Nhanh Nhất: 70 triệu/cửa hàng',
        ],
        gala: 'Tiệc Gala tại khách sạn 5 sao',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Hội Nghị Khởi Động Quý 2/2025',
      description:
        'Công bố chiến lược kinh doanh Quý 2, ra mắt sản phẩm mới và chương trình ưu đãi hấp dẫn cho đối tác.',
      startDate: new Date('2025-04-01T08:30:00Z'),
      endDate: new Date('2025-04-01T16:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80',
      gallery: [],
      content: {
        agenda: [
          '08:30 - Đón tiếp & check-in',
          '09:00 - Báo cáo kết quả Quý 1',
          '10:30 - Ra mắt sản phẩm mới',
          '14:00 - Chương trình khuyến mại Quý 2',
          '15:30 - Giao lưu kết nối',
        ],
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Ngày Hội Sức Khỏe Cộng Đồng',
      description:
        'Sự kiện khám sức khỏe miễn phí do ADK tổ chức, nhằm tăng nhận diện thương hiệu và kết nối với cộng đồng địa phương.',
      startDate: new Date('2025-07-15T07:00:00Z'),
      endDate: new Date('2025-07-15T17:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
      ],
      content: {
        services: [
          'Đo huyết áp, đường huyết miễn phí',
          'Tư vấn dinh dưỡng từ chuyên gia',
          'Quà tặng sức khỏe cho 500 khách đầu tiên',
          'Giảm 20% sản phẩm tại sự kiện',
        ],
        location: 'Công viên Lê Văn Tám, Quận 1',
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Hội Thảo Xu Hướng Sống Khỏe 2025',
      description:
        'Hội thảo về xu hướng chăm sóc sức khỏe toàn diện, từ thuốc chữa bệnh đến dinh dưỡng phòng ngừa.',
      startDate: new Date('2025-08-20T14:00:00Z'),
      endDate: new Date('2025-08-20T17:30:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80'],
      content: {
        speakers: [
          'BS. Nguyễn Văn A - Chuyên gia Dinh Dưỡng',
          'Dược sĩ Trần Thị B - Giám Đốc Y Khoa ADK',
          'CEO Lê Văn C - Người sáng lập ADK Pharma',
        ],
        topics: [
          'Thực Phẩm Chức Năng: Lựa Chọn Thông Minh',
          'Chế Độ Ăn Cho Người Mắc Bệnh Mạn Tính',
          'Kết Hợp Y Học Hiện Đại Và Y Học Cổ Truyền',
        ],
      },
      isFeatured: true,
      isVisible: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // 4. Business Models
  console.log('Đang tạo mô hình kinh doanh B2B...');
  const businessModels = [
    {
      name: 'Nguồn Doanh Thu Đa Dạng',
      description:
        'Tối ưu lợi nhuận từ nhà thuốc GPP và thực phẩm sức khỏe. Biên lợi nhuận gộp 25-40% tùy danh mục sản phẩm. Không phụ thuộc vào một nguồn doanh thu duy nhất.',
      iconUrl: '/images/icons/revenue.svg',
      profitPotential: '25-40%',
      sortOrder: 0,
      isVisible: true,
    },
    {
      name: 'Vận Hành Tự Động',
      description:
        'Hệ thống ERP quản lý tồn kho, app bán hàng và hóa đơn điện tử tích hợp. Tiết kiệm chi phí nhân sự và thời gian vận hành.',
      iconUrl: '/images/icons/automation.svg',
      profitPotential: 'Tiết kiệm 30%',
      sortOrder: 1,
      isVisible: true,
    },
    {
      name: 'Chuỗi Cung Ứng Chủ Động',
      description:
        'Kết nối trực tiếp nhà máy & nguồn nguyên liệu. Giá xưởng, không trung gian, giao đúng hạn. Hỗ trợ trả hàng tồn kho chậm.',
      iconUrl: '/images/icons/supply-chain.svg',
      profitPotential: 'Giá tốt nhất',
      sortOrder: 2,
      isVisible: true,
    },
    {
      name: 'Thương Hiệu Uy Tín',
      description:
        'Hệ thống nhận diện thương hiệu thống nhất, chuyên nghiệp. Được khách hàng tin tưởng với hơn 10 năm hoạt động.',
      iconUrl: '/images/icons/brand.svg',
      profitPotential: 'Hơn 10 năm uy tín',
      sortOrder: 3,
      isVisible: true,
    },
    {
      name: 'Hỗ Trợ Vốn',
      description:
        'Hỗ trợ vốn hàng hóa ban đầu, chi phí vận hành tháng đầu tiên. Giảm áp lực tài chính cho đối tác mới.',
      iconUrl: '/images/icons/funding.svg',
      profitPotential: 'Hỗ trợ 50%',
      sortOrder: 4,
      isVisible: true,
    },
    {
      name: 'Setup Trọn Gói',
      description:
        'Thiết kế và thi công cửa hàng từ A-Z. Bàn giao trong 30-45 ngày, sẵn sàng kinh doanh khi khai trương.',
      iconUrl: '/images/icons/setup.svg',
      profitPotential: '30-45 ngày',
      sortOrder: 5,
      isVisible: true,
    },
  ];

  for (const model of businessModels) {
    await prisma.businessModel.create({ data: model });
  }

  // 5. Partnership FAQs
  console.log('Đang tạo câu hỏi thường gặp B2B...');
  const partnershipFaqs = [
    {
      question: 'Tôi cần bao nhiêu vốn để bắt đầu?',
      answer:
        'Đầu tư linh hoạt từ 500 triệu - 2 tỉ VNĐ tùy diện tích mặt bằng (40-100m²). Liên hệ với chúng tôi để nhận báo giá chi tiết phù hợp với điều kiện của bạn.',
      sortOrder: 0,
      isVisible: true,
    },
    {
      question: 'ADK hỗ trợ nguồn hàng như thế nào?',
      answer:
        'Danh mục sản phẩm chuẩn hóa bao gồm thuốc, TPBVSK, thực phẩm sức khỏe và sản phẩm OCOP. Giá tốt nhất từ kho trung tâm, giao hàng đều đặn, hỗ trợ trả hàng tồn kho chậm.',
      sortOrder: 1,
      isVisible: true,
    },
    {
      question: 'Tôi có được đào tạo nhân viên không?',
      answer:
        'Có. ADK cung cấp đào tạo toàn diện cho dược sĩ và nhân viên về: Kỹ năng bán lẻ, Tư vấn dinh dưỡng, Sử dụng hệ thống ERP, và Quy trình vận hành chuẩn GPP.',
      sortOrder: 2,
      isVisible: true,
    },
    {
      question: 'Thời gian hoàn vốn dự kiến là bao lâu?',
      answer:
        'Với địa điểm tốt và vận hành đúng cách, thời gian hoàn vốn trung bình 18-24 tháng. Doanh thu trung bình 300-500 triệu VNĐ/tháng tùy quy mô.',
      sortOrder: 3,
      isVisible: true,
    },
    {
      question: 'ADK hỗ trợ marketing như thế nào?',
      answer:
        'Hỗ trợ marketing đa kênh: Fanpage chung, SEO địa phương, chương trình khuyến mại toàn hệ thống, tài liệu marketing sẵn có. Chi phí marketing được chia sẻ trong toàn hệ thống.',
      sortOrder: 4,
      isVisible: true,
    },
    {
      question: 'Quy trình hợp tác như thế nào?',
      answer:
        'Quy trình 5 bước: (1) Đăng ký tư vấn → (2) Khảo sát địa điểm → (3) Ký hợp đồng → (4) Setup cửa hàng (30-45 ngày) → (5) Khai trương và vận hành.',
      sortOrder: 5,
      isVisible: true,
    },
    {
      question: 'Tôi có thể tham gia khi chưa có kinh nghiệm kinh doanh thuốc không?',
      answer:
        'Hoàn toàn có thể! ADK hỗ trợ toàn diện từ A-Z, kể cả người mới bắt đầu. Chúng tôi có đội ngũ chuyên gia hỗ trợ setup, đào tạo và vận hành. Yêu cầu duy nhất là bạn cần có hoặc thuê dược dược sĩ chịu trách nhiệm chuyên môn.',
      sortOrder: 6,
      isVisible: true,
    },
    {
      question: 'Diện tích mặt bằng tối thiểu là bao nhiêu?',
      answer:
        'Tối thiểu 40m² cho mô hình cơ bản. Mô hình tiêu chuẩn từ 60-80m², mô hình mở rộng từ 100m² trở lên. ADK tư vấn thiết kế tối ưu dựa trên mặt bằng thực tế của bạn.',
      sortOrder: 7,
      isVisible: true,
    },
    {
      question: 'Cần những giấy phép gì để mở nhà thuốc?',
      answer:
        'Bạn cần Giấy chứng nhận đủ điều kiện kinh doanh Dược (GPP) do Sở Y Tế cấp. ADK hỗ trợ toàn bộ thủ tục hồ sơ, pháp lý và đồng hành cùng bạn trong quá trình xin giấy phép.',
      sortOrder: 8,
      isVisible: true,
    },
    {
      question: 'Phí nhượng quyền và phí quản lý hàng tháng là bao nhiêu?',
      answer:
        'Phí nhượng quyền ban đầu: 50-100 triệu VNĐ (một lần). Phí quản lý hệ thống: 2-3% doanh thu/tháng, bao gồm: ERP, marketing, đào tạo, hỗ trợ vận hành.',
      sortOrder: 9,
      isVisible: true,
    },
    {
      question: 'Tôi có thể tự chọn nhà cung cấp không?',
      answer:
        'Bạn có thể nhập thêm sản phẩm từ nhà cung cấp riêng, nhưng phải đảm bảo chất lượng và nguồn gốc rõ ràng. Tuy nhiên nhập từ kho ADK sẽ có giá tốt hơn và được hỗ trợ marketing.',
      sortOrder: 10,
      isVisible: true,
    },
    {
      question: 'ADK có giúp tìm mặt bằng không?',
      answer:
        'Có. Đội ngũ ADK có kinh nghiệm tư vấn địa điểm kinh doanh, phân tích thị trường địa phương, và kết nối với chủ nhà tiềm năng tại khu vực bạn quan tâm.',
      sortOrder: 11,
      isVisible: true,
    },
    {
      question: 'Nếu kinh doanh không hiệu quả thì có hỗ trợ gì?',
      answer:
        'ADK cam kết đồng hành lâu dài. Nếu gặp khó khăn, chúng tôi sẽ: (1) Phân tích nguyên nhân, (2) Điều chỉnh chiến lược marketing, (3) Tư vấn vận hành, (4) Tổ chức chương trình khuyến mại kích cầu.',
      sortOrder: 12,
      isVisible: true,
    },
    {
      question: 'Thời hạn hợp đồng hợp tác là bao lâu?',
      answer:
        'Thời hạn hợp đồng nhượng quyền là 5 năm, có thể gia hạn. Trong thời gian hợp đồng, đối tác được hưởng đầy đủ quyền lợi và sự hỗ trợ từ ADK.',
      sortOrder: 13,
      isVisible: true,
    },
    {
      question: 'Tôi có thể mở nhiều cửa hàng không?',
      answer:
        'Có. Sau khi cửa hàng đầu tiên hoạt động ổn định (6-12 tháng), ADK khuyến khích mở rộng với ưu đãi phí nhượng quyền và hỗ trợ vốn cho cửa hàng thứ 2, 3.',
      sortOrder: 14,
      isVisible: true,
    },
  ];

  for (const faq of partnershipFaqs) {
    await prisma.partnershipFaq.create({ data: faq });
  }

  // 6. Page Sections - B2B Focused Content
  console.log('Đang tạo các phần trang B2B...');
  const sections = [
    {
      key: 'hero_main',
      layoutType: LayoutType.HERO_IMAGE,
      content: {
        title: 'DỰ ÁN PHÁT TRIỂN CHUỐI NHÀ THUỐC ADK',
        subtitle: 'Mô Hình Siêu Thị Thuốc & Thực Phẩm Sức Khỏe - Xu Hướng Kinh Doanh Bền Vững 2025.',
        ctaText: 'Đăng Ký Hợp Tác Ngay',
        stats: [
          { value: 'Hơn 10', label: 'Năm kinh nghiệm' },
          { value: 'Hơn 100', label: 'Đối tác' },
          { value: '2025', label: 'Xu hướng mới' },
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
        title: 'Nắm Bắt Xu Hướng Tương Lai',
        subtitle: 'Thị Trường 2025',
        description:
          'Năm 2025, người tiêu dùng chuyển từ "Chữa Bệnh" sang "Chăm Sóc Sức Khỏe Chủ Động". Mô hình ADK giải quyết với sự kết hợp hoàn hảo giữa Nhà Thuốc GPP và Siêu Thị Thực Phẩm Sức Khỏe.',
        keyPoints: [
          'Ngành Dược tăng trưởng 8-10%/năm',
          'Xu hướng Sống Khỏe lan tỏa',
          'Người tiêu dùng ưu tiên nguồn gốc rõ ràng',
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
        title: 'Mô Hình ADK',
        subtitle: 'Giao Điểm Của Thuốc & Dinh Dưỡng',
        leftColumn: {
          title: 'Nhà Thuốc GPP Hiện Đại',
          items: [
            'Thuốc kê đơn & Thuốc không kê đơn',
            'Thực phẩm bảo vệ sức khỏe',
            'Dược mỹ phẩm chính hãng',
          ],
        },
        rightColumn: {
          title: 'Siêu Thị Tự Phục Vụ',
          items: ['Sữa thực vật, Sữa tươi hữu cơ', 'Thực phẩm hữu cơ', 'Đặc sản OCOP vùng miền'],
        },
        bottomText: 'Chuyển đổi nhà thuốc truyền thống thành điểm đến Sống Khỏe.',
      },
      images: ['/images/model/pharmacy-side.jpg', '/images/model/supermarket-side.jpg'],
      sortOrder: 2,
      isVisible: true,
    },
    {
      key: 'investment_benefits',
      layoutType: LayoutType.BENTO_GRID,
      content: {
        title: 'Lợi Ích Đầu Tư',
        subtitle: 'Tại sao chọn ADK?',
        items: [
          {
            id: 'revenue',
            title: 'Nguồn Doanh Thu Đa Dạng',
            description:
              'Tối ưu lợi nhuận từ nhà thuốc và thực phẩm sức khỏe. Không phụ thuộc vào một nguồn doanh thu duy nhất.',
            icon: 'trending-up',
            size: 'large',
          },
          {
            id: 'automation',
            title: 'Vận Hành Tự Động',
            description: 'Hệ thống ERP tích hợp, App quản lý, Hóa đơn điện tử.',
            icon: 'cpu',
            size: 'medium',
          },
          {
            id: 'supply',
            title: 'Chuỗi Cung Ứng Chủ Động',
            description:
              'Kết nối trực tiếp nhà máy & nguồn nguyên liệu. Giá xưởng, không trung gian.',
            icon: 'package',
            size: 'medium',
          },
          {
            id: 'support',
            title: 'Hỗ Trợ Toàn Diện',
            description: 'Hỗ trợ vốn, Setup cửa hàng A-Z, Marketing đa kênh.',
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
        title: 'Tiêu Chuẩn Cửa Hàng ADK',
        subtitle: 'Thiết kế thống nhất, chuyên nghiệp',
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
        title: 'Cơ Hội Trở Thành Đối Tác Chiến Lược',
        subtitle: 'Đăng ký ngay để nhận tư vấn miễn phí và báo giá chi tiết',
        ctaText: 'Đăng Ký Hợp Tác Ngay',
        secondaryText: 'Hotline tư vấn: 1800-1234',
      },
      images: ['/images/cta/partnership-bg.jpg'],
      ctaLink: 'https://bizmall.vn',
      sortOrder: 5,
      isVisible: true,
    },
    {
      key: 'success_stories',
      layoutType: LayoutType.CAROUSEL,
      content: {
        title: 'Câu Chuyện Thành Công',
        subtitle: 'Từ các đối tác của chúng tôi',
        cards: [
          {
            id: 1,
            name: 'Dược Sĩ Nguyễn Thị Mai',
            location: 'Nhà Thuốc ADK Bình Thạnh',
            story:
              'Từ nhà thuốc 40m² thành chuỗi 3 cửa hàng trong 2 năm. Doanh thu tháng đạt 450 triệu.',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
            revenue: '450 triệu/tháng',
          },
          {
            id: 2,
            name: 'Anh Trần Văn Hùng',
            location: 'ADK Healthy Hub Đà Nẵng',
            story:
              'Chuyển đổi từ cửa hàng tạp hóa sang mô hình ADK. Thu nhập tăng gấp 3 lần, phục vụ hơn 200 khách/ngày.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
            revenue: '320 triệu/tháng',
          },
          {
            id: 3,
            name: 'Chị Phạm Thu Hương',
            location: 'ADK Fresh Mart Hà Nội',
            story: 'Hoàn vốn sau 18 tháng. Khách hàng quen thuộc từ các khu vực xung quanh.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
            revenue: '280 triệu/tháng',
          },
        ],
      },
      images: [],
      sortOrder: 6,
      isVisible: true,
    },
    {
      key: 'roadmap_partnership',
      layoutType: LayoutType.TEXT_ONLY,
      content: {
        title: 'Lộ Trình Hợp Tác',
        subtitle: 'Từ ý tưởng đến khai trương',
        steps: [
          {
            phase: 'Tuần 1-2',
            title: 'Tư Vấn & Khảo Sát',
            description: 'Gặp chuyên gia, khảo sát địa điểm, phân tích thị trường địa phương',
          },
          {
            phase: 'Tuần 3',
            title: 'Ký Hợp Đồng',
            description: 'Thống nhất điều kiện, ký hợp đồng nhượng quyền, thanh toán phí ban đầu',
          },
          {
            phase: 'Tuần 4-5',
            title: 'Thiết Kế & Chuẩn Bị',
            description: 'Thiết kế 3D cửa hàng, làm thủ tục giấy phép, đặt hàng thiết bị và sản phẩm',
          },
          {
            phase: 'Tuần 6-9',
            title: 'Thi Công & Lắp Đặt',
            description: 'Thi công cửa hàng, lắp đặt thiết bị, cài đặt hệ thống ERP',
          },
          {
            phase: 'Tuần 10',
            title: 'Đào Tạo Nhân Viên',
            description: 'Đào tạo dược sĩ và nhân viên về sản phẩm, quy trình, hệ thống',
          },
          {
            phase: 'Tuần 11',
            title: 'Khai Trương',
            description: 'Sự kiện khai trương, chiến dịch marketing, hỗ trợ vận hành tháng đầu',
          },
        ],
      },
      images: [],
      sortOrder: 7,
      isVisible: true,
    },
    {
      key: 'product_categories',
      layoutType: LayoutType.BENTO_GRID,
      content: {
        title: 'Danh Mục Sản Phẩm Đa Dạng',
        subtitle: 'Hơn 5,000 SKU từ 200+ thương hiệu uy tín',
        features: [
          {
            icon: 'pill',
            title: 'Thuốc Kê Đơn & Thuốc Không Kê Đơn',
            description: 'Hơn 2,000 SKU từ các công ty dược hàng đầu',
            stat: '40%',
          },
          {
            icon: 'heart',
            title: 'Thực Phẩm Bảo Vệ Sức Khỏe',
            description: 'Vitamin, khoáng chất, sản phẩm thảo dược',
            stat: '25%',
          },
          {
            icon: 'droplet',
            title: 'Dược Mỹ Phẩm',
            description: 'Chăm sóc da và tóc từ thương hiệu y khoa',
            stat: '15%',
          },
          {
            icon: 'leaf',
            title: 'Thực Phẩm Hữu Cơ',
            description: 'Sữa thực vật, ngũ cốc, thực phẩm sạch',
            stat: '10%',
          },
          {
            icon: 'baby',
            title: 'Mẹ & Bé',
            description: 'Sữa bột, tã giấy, sản phẩm cho bé',
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
      images: [],
      sortOrder: 8,
      isVisible: true,
    },
    {
      key: 'technology_stack',
      layoutType: LayoutType.SPLIT_IMAGE_TEXT,
      content: {
        title: 'Công Nghệ Vận Hành',
        subtitle: 'Hệ thống quản lý toàn diện',
        leftColumn: {
          title: 'Phần Mềm Quản Lý',
          items: [
            'ERP quản lý tồn kho thời gian thực',
            'POS tích hợp thanh toán',
            'App mobile cho nhân viên',
            'Hóa đơn điện tử tự động',
          ],
        },
        rightColumn: {
          title: 'Marketing & CRM',
          items: [
            'Tích hợp Zalo OA, Facebook',
            'SMS Marketing tự động',
            'Chương trình khách hàng thân thiết',
            'Báo cáo doanh thu thời gian thực',
          ],
        },
        bottomText: 'Tiết kiệm 30% thời gian vận hành nhờ tự động hóa',
      },
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      ],
      sortOrder: 9,
      isVisible: true,
    },
    {
      key: 'support_team',
      layoutType: LayoutType.BENTO_GRID,
      content: {
        title: 'Đội Ngũ Hỗ Trợ 24/7',
        subtitle: 'Luôn sẵn sàng đồng hành cùng bạn',
        items: [
          {
            id: 'tech',
            title: 'Hỗ Trợ Kỹ Thuật',
            description: 'Giải quyết sự cố hệ thống và phần mềm trong vòng 2 giờ',
            icon: 'headset',
            size: 'large',
          },
          {
            id: 'supply',
            title: 'Quản Lý Nguồn Hàng',
            description: 'Tư vấn đặt hàng, tối ưu hóa tồn kho',
            icon: 'truck',
            size: 'medium',
          },
          {
            id: 'marketing',
            title: 'Chuyên Viên Marketing',
            description: 'Hỗ trợ chiến dịch, thiết kế nội dung',
            icon: 'megaphone',
            size: 'medium',
          },
          {
            id: 'training',
            title: 'Đào Tạo Liên Tục',
            description: 'Workshop hàng tháng, webinar sản phẩm mới',
            icon: 'book',
            size: 'large',
          },
        ],
      },
      images: [],
      sortOrder: 10,
      isVisible: true,
    },
  ];

  for (const section of sections) {
    await prisma.section.create({ data: section });
  }

  // 7. Content - B2B FAQ Content
  console.log('Đang tạo nội dung FAQ B2B...');
  const partnerFaqs = [
    {
      type: ContentType.FAQ,
      title: 'Tôi cần bao nhiêu vốn để bắt đầu?',
      description:
        'Đầu tư linh hoạt từ 500 triệu - 2 tỉ VNĐ tùy diện tích mặt bằng (40-100m²). Liên hệ với chúng tôi để nhận báo giá chi tiết phù hợp với điều kiện của bạn.',
      content: { category: 'investment' },
      sortOrder: 0,
    },
    {
      type: ContentType.FAQ,
      title: 'ADK hỗ trợ nguồn hàng như thế nào?',
      description:
        'Danh mục sản phẩm chuẩn hóa bao gồm thuốc, TPBVSK, thực phẩm sức khỏe và sản phẩm OCOP. Giá tốt nhất từ kho trung tâm, giao hàng đều đặn, hỗ trợ trả hàng tồn kho chậm.',
      content: { category: 'supply' },
      sortOrder: 1,
    },
    {
      type: ContentType.FAQ,
      title: 'Tôi có được đào tạo nhân viên không?',
      description:
        'Có. ADK cung cấp đào tạo toàn diện cho dược sĩ và nhân viên về: Kỹ năng bán lẻ, Tư vấn dinh dưỡng, Sử dụng hệ thống ERP, và Quy trình vận hành chuẩn GPP.',
      content: { category: 'training' },
      sortOrder: 2,
    },
    {
      type: ContentType.FAQ,
      title: 'Thời gian hoàn vốn dự kiến là bao lâu?',
      description:
        'Với địa điểm tốt và vận hành đúng cách, thời gian hoàn vốn trung bình 18-24 tháng. Doanh thu trung bình 300-500 triệu VNĐ/tháng tùy quy mô.',
      content: { category: 'roi' },
      sortOrder: 3,
    },
    {
      type: ContentType.FAQ,
      title: 'ADK hỗ trợ marketing như thế nào?',
      description:
        'Hỗ trợ marketing đa kênh: Fanpage chung, SEO địa phương, chương trình khuyến mại toàn hệ thống, tài liệu marketing sẵn có. Chi phí marketing được chia sẻ trong toàn hệ thống.',
      content: { category: 'marketing' },
      sortOrder: 4,
    },
    {
      type: ContentType.FAQ,
      title: 'Quy trình hợp tác như thế nào?',
      description:
        'Quy trình 5 bước: (1) Đăng ký tư vấn → (2) Khảo sát địa điểm → (3) Ký hợp đồng → (4) Setup cửa hàng (30-45 ngày) → (5) Khai trương và vận hành.',
      content: { category: 'process' },
      sortOrder: 5,
    },
  ];

  for (const faq of partnerFaqs) {
    await prisma.content.create({ data: faq });
  }

  // 8. Investment Features - B2B Features Content
  console.log('Đang tạo tính năng đầu tư B2B...');
  const investmentFeatures = [
    {
      type: ContentType.FEATURE,
      title: 'Nguồn Doanh Thu Đa Dạng',
      description:
        'Tối ưu lợi nhuận từ nhà thuốc GPP và thực phẩm sức khỏe. Biên lợi nhuận gộp 25-40% tùy danh mục sản phẩm.',
      content: { icon: 'trending-up' },
      sortOrder: 0,
    },
    {
      type: ContentType.FEATURE,
      title: 'Vận Hành Tự Động',
      description:
        'Hệ thống ERP quản lý tồn kho, app bán hàng và hóa đơn điện tử tích hợp. Tiết kiệm chi phí nhân sự.',
      content: { icon: 'cpu' },
      sortOrder: 1,
    },
    {
      type: ContentType.FEATURE,
      title: 'Chuỗi Cung Ứng Chủ Động',
      description:
        'Kết nối trực tiếp nhà máy & nguồn nguyên liệu. Giá xưởng, không trung gian, giao đúng hạn.',
      content: { icon: 'package' },
      sortOrder: 2,
    },
    {
      type: ContentType.FEATURE,
      title: 'Thương Hiệu Uy Tín',
      description: 'Hệ thống nhận diện thương hiệu thống nhất, chuyên nghiệp. Được khách hàng tin tưởng.',
      content: { icon: 'badge' },
      sortOrder: 3,
    },
    {
      type: ContentType.FEATURE,
      title: 'Hỗ Trợ Vốn',
      description:
        'Hỗ trợ vốn hàng hóa ban đầu, chi phí vận hành tháng đầu tiên. Giảm áp lực tài chính.',
      content: { icon: 'wallet' },
      sortOrder: 4,
    },
    {
      type: ContentType.FEATURE,
      title: 'Setup Trọn Gói',
      description:
        'Thiết kế và thi công cửa hàng từ A-Z. Bàn giao trong 30-45 ngày, sẵn sàng kinh doanh.',
      content: { icon: 'store' },
      sortOrder: 5,
    },
  ];

  for (const feature of investmentFeatures) {
    await prisma.content.create({ data: feature });
  }

  // 9. Photo Gallery - Thư Viện Hình Ảnh
  console.log('Đang tạo danh mục và ảnh thư viện hình ảnh...');

  const photoCategories = [
    {
      name: 'Tất Cả',
      slug: 'tat-ca',
      sortOrder: 0,
      isVisible: true,
    },
    {
      name: 'Cửa Hàng',
      slug: 'cua-hang',
      sortOrder: 1,
      isVisible: true,
    },
    {
      name: 'Sản Phẩm',
      slug: 'san-pham',
      sortOrder: 2,
      isVisible: true,
    },
    {
      name: 'Sự Kiện',
      slug: 'su-kien',
      sortOrder: 3,
      isVisible: true,
    },
    {
      name: 'Đội Ngũ',
      slug: 'doi-ngu',
      sortOrder: 4,
      isVisible: true,
    },
  ];

  const createdCategories: any = {};
  for (const category of photoCategories) {
    const created = await prisma.photoCategory.create({ data: category });
    createdCategories[category.slug] = created;
    console.log(`  ✓ Created category: ${category.name}`);
  }

  // Photo data for each category
  const photos = [
    // Cửa Hàng (Store)
    {
      title: 'ADK Pharmacy Bình Thạnh - Mặt Tiền',
      description: 'Cửa hàng ADK Pharmacy tại Bình Thạnh với thiết kế hiện đại, mặt tiền rộng rãi',
      imageUrl: 'https://images.unsplash.com/photo-1576602975515-26e1dcdd70a4?w=800&q=80',
      categoryId: createdCategories['cua-hang'].id,
      sortOrder: 0,
    },
    {
      title: 'Khu Vực Quầy Thuốc',
      description: 'Quầy dược sĩ tư vấn chuyên nghiệp theo chuẩn GPP',
      imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
      categoryId: createdCategories['cua-hang'].id,
      sortOrder: 1,
    },
    {
      title: 'Kệ Trưng Bày Thực Phẩm Chức Năng',
      description: 'Khu vực self-service với hệ thống kệ trưng bày sản phẩm bài bản',
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
      categoryId: createdCategories['cua-hang'].id,
      sortOrder: 2,
    },
    {
      title: 'ADK Healthy Hub Đà Nẵng',
      description: 'Chi nhánh tại Đà Nẵng - mô hình siêu thị thuốc kết hợp thực phẩm hữu cơ',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      categoryId: createdCategories['cua-hang'].id,
      sortOrder: 3,
    },
    {
      title: 'Quầy Thu Ngân Tự Động',
      description: 'Hệ thống POS hiện đại, thanh toán nhanh chóng',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      categoryId: createdCategories['cua-hang'].id,
      sortOrder: 4,
    },
    {
      title: 'Khu Vực Chờ Tư Vấn',
      description: 'Không gian chờ thoải mái, sang trọng cho khách hàng',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      categoryId: createdCategories['cua-hang'].id,
      sortOrder: 5,
    },

    // Sản Phẩm (Products)
    {
      title: 'Dòng Vitamin Tổng Hợp',
      description: 'Vitamin từ các thương hiệu uy tín, đa dạng công dụng',
      imageUrl: 'https://images.unsplash.com/photo-1550572017-4870b1d06c86?w=800&q=80',
      categoryId: createdCategories['san-pham'].id,
      sortOrder: 0,
    },
    {
      title: 'Thực Phẩm Hữu Cơ Organic',
      description: 'Ngũ cốc, sữa thực vật, thực phẩm hữu cơ chứng nhận',
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
      categoryId: createdCategories['san-pham'].id,
      sortOrder: 1,
    },
    {
      title: 'Sữa Bột Cao Cấp',
      description: 'Dòng sữa cho mẹ và bé từ các nhãn hiệu hàng đầu',
      imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80',
      categoryId: createdCategories['san-pham'].id,
      sortOrder: 2,
    },
    {
      title: 'Mỹ Phẩm Y Khoa',
      description: 'Dược mỹ phẩm chăm sóc da chuyên sâu',
      imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
      categoryId: createdCategories['san-pham'].id,
      sortOrder: 3,
    },
    {
      title: 'Thiết Bị Y Tế Gia Đình',
      description: 'Máy đo huyết áp, nhiệt kế, máy đo đường huyết',
      imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80',
      categoryId: createdCategories['san-pham'].id,
      sortOrder: 4,
    },
    {
      title: 'Sản Phẩm OCOP Đặc Sản Vùng Miền',
      description: 'Đặc sản các vùng miền đạt chuẩn OCOP 3-4 sao',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      categoryId: createdCategories['san-pham'].id,
      sortOrder: 5,
    },

    // Sự Kiện (Events)
    {
      title: 'Hội Thảo Đầu Tư Nhượng Quyền 2025',
      description: 'Sự kiện quy tụ hơn 200 nhà đầu tư tiềm năng',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      categoryId: createdCategories['su-kien'].id,
      sortOrder: 0,
    },
    {
      title: 'Lễ Ký Kết Đối Tác Chiến Lược',
      description: 'Chào đón 15 đối tác mới gia nhập hệ thống ADK',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      categoryId: createdCategories['su-kien'].id,
      sortOrder: 1,
    },
    {
      title: 'Workshop Vận Hành Nhà Thuốc Hiện Đại',
      description: 'Đào tạo kỹ năng quản lý và vận hành cho đối tác',
      imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
      categoryId: createdCategories['su-kien'].id,
      sortOrder: 2,
    },
    {
      title: 'Ngày Hội Sức Khỏe Cộng Đồng',
      description: 'Khám sức khỏe miễn phí cho 500+ người dân',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      categoryId: createdCategories['su-kien'].id,
      sortOrder: 3,
    },
    {
      title: 'Hội Chợ Triển Lãm Y Dược 2025',
      description: 'ADK tham gia gian hàng tại hội chợ quốc tế',
      imageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&q=80',
      categoryId: createdCategories['su-kien'].id,
      sortOrder: 4,
    },
    {
      title: 'Lễ Vinh Danh Đối Tác Xuất Sắc 2024',
      description: 'Tôn vinh những đối tác có thành tích kinh doanh vượt trội',
      imageUrl: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&q=80',
      categoryId: createdCategories['su-kien'].id,
      sortOrder: 5,
    },

    // Đội Ngũ (Team)
    {
      title: 'CEO - Nhà Sáng Lập ADK Pharma',
      description: 'Dược sĩ Lê Văn C - 15 năm kinh nghiệm ngành dược',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
      categoryId: createdCategories['doi-ngu'].id,
      sortOrder: 0,
    },
    {
      title: 'Giám Đốc Y Khoa',
      description: 'Dược sĩ Trần Thị B - Chuyên gia tư vấn dinh dưỡng',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      categoryId: createdCategories['doi-ngu'].id,
      sortOrder: 1,
    },
    {
      title: 'Đội Ngũ Dược Sĩ Chuyên Nghiệp',
      description: 'Hơn 50 dược sĩ được đào tạo bài bản, tận tâm với nghề',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      categoryId: createdCategories['doi-ngu'].id,
      sortOrder: 2,
    },
    {
      title: 'Nhân Viên Tư Vấn Tại Quầy',
      description: 'Đội ngũ nhân viên nhiệt tình, am hiểu sản phẩm',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
      categoryId: createdCategories['doi-ngu'].id,
      sortOrder: 3,
    },
    {
      title: 'Bộ Phận Hỗ Trợ Kỹ Thuật',
      description: 'Team IT hỗ trợ hệ thống 24/7 cho đối tác',
      imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80',
      categoryId: createdCategories['doi-ngu'].id,
      sortOrder: 4,
    },
    {
      title: 'Đội Ngũ Marketing & Truyền Thông',
      description: 'Chuyên gia marketing hỗ trợ đối tác phát triển thương hiệu',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      categoryId: createdCategories['doi-ngu'].id,
      sortOrder: 5,
    },
  ];

  // Add all photos to "Tất Cả" category and their specific category
  for (const photo of photos) {
    // Create for specific category
    await prisma.photo.create({ data: photo });
    
    // Also create for "Tất Cả" category if not already in it
    if (photo.categoryId !== createdCategories['tat-ca'].id) {
      await prisma.photo.create({
        data: {
          ...photo,
          categoryId: createdCategories['tat-ca'].id,
        },
      });
    }
  }

  console.log(`  ✓ Created ${photos.length} photos across ${photoCategories.length} categories`);

  // 10. Admin Users
  console.log('Đang tạo tài khoản admin...');

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

  console.log('\n=== Seed Dữ Liệu B2B Hoàn Tất! ===');
  console.log('\n📋 Thông Tin Đăng Nhập:');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│ SUPER ADMIN                                         │');
  console.log('│ Email: admin@adkpharma.vn                          │');
  console.log('│ Mật khẩu: Admin@2025                               │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log('│ ADMIN                                               │');
  console.log('│ Email: manager@adkpharma.vn                        │');
  console.log('│ Mật khẩu: Manager@2025                             │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log('│ HỖ TRỢ                                              │');
  console.log('│ Email: support@adkpharma.vn                        │');
  console.log('│ Mật khẩu: Support@2025                             │');
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('\n⚠️  Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên!\n');
}

main()
  .catch(e => {
    console.error('Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
