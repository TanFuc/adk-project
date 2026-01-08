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
    {
      key: 'logo',
      value: {
        main: '/images/logo/adk-logo.png',
        light: '/images/logo/adk-logo-light.png',
        dark: '/images/logo/adk-logo-dark.png',
        favicon: '/images/logo/favicon.ico',
      },
      description: 'Website logo configuration',
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
      title: 'Northern Region Partner Recruitment Roadshow',
      description:
        'Series of events introducing the ADK model in Hanoi, Hai Phong, Quang Ninh. Meet with investment consulting experts.',
      startDate: new Date('2025-04-10T08:00:00Z'),
      endDate: new Date('2025-04-12T17:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      ],
      content: {
        schedule: [
          'Apr 10: Hanoi - Melia Hotel',
          'Apr 11: Hai Phong - Convention Center',
          'Apr 12: Quang Ninh - Vinpearl Hotel',
        ],
        benefits: 'Special offers for the first 10 partners at each location',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Medical Equipment & Pharmaceutical Exhibition 2025',
      description:
        'ADK participates in the international exhibition with a booth introducing the modern Pharmacy Supermarket model. Visitors can experience the 3D model.',
      startDate: new Date('2025-05-20T09:00:00Z'),
      endDate: new Date('2025-05-23T18:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80',
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      ],
      content: {
        location: 'SECC - District 7, HCMC',
        booth: 'Booth A12-15',
        activities: [
          'ERP management system demo',
          '1-on-1 consultation with experts',
          'Gifts for visitors',
        ],
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'National Pharmacist Training Program',
      description:
        '3-day intensive training course on GPP standard pharmacy operations, customer consulting skills, and effective business management.',
      startDate: new Date('2025-06-05T08:00:00Z'),
      endDate: new Date('2025-06-07T17:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      ],
      content: {
        modules: [
          'Day 1: GPP standards and quality management',
          'Day 2: Consulting and customer care skills',
          'Day 3: Financial management and marketing',
        ],
        certification: 'Completion certificate from Vietnam Pharmacist Association',
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Outstanding Partner Awards 2024',
      description:
        'Honoring pharmacies with highest revenue and best customer service. Total prize value 500 million VND.',
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
          'Top 10 Highest Revenue: 50 million/store',
          'Top 5 Customer Satisfaction: 30 million/store',
          'Top 3 Fastest Growth: 70 million/store',
        ],
        gala: 'Gala dinner at 5-star hotel',
      },
      isFeatured: true,
      isVisible: true,
    },
    {
      title: 'Q2/2025 Kickoff Conference',
      description:
        'Announcing Q2 business strategy, launching new products and attractive promotions for partners.',
      startDate: new Date('2025-04-01T08:30:00Z'),
      endDate: new Date('2025-04-01T16:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80',
      gallery: [],
      content: {
        agenda: [
          '08:30 - Reception & check-in',
          '09:00 - Q1 Results Report',
          '10:30 - New Product Launch',
          '14:00 - Q2 Promotion Programs',
          '15:30 - Networking',
        ],
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Community Health Day',
      description:
        'Free health check-up event organized by ADK, aimed at increasing brand awareness and connecting with the local community.',
      startDate: new Date('2025-07-15T07:00:00Z'),
      endDate: new Date('2025-07-15T17:00:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
      ],
      content: {
        services: [
          'Free blood pressure and blood sugar measurement',
          'Nutrition consultation from experts',
          'Health gifts for first 500 guests',
          '20% discount on products at the event',
        ],
        location: 'Le Van Tam Park, District 1',
      },
      isFeatured: false,
      isVisible: true,
    },
    {
      title: 'Healthy Living Trends 2025 Seminar',
      description:
        'Seminar on comprehensive healthcare trends, from treatment medication to preventive nutrition.',
      startDate: new Date('2025-08-20T14:00:00Z'),
      endDate: new Date('2025-08-20T17:30:00Z'),
      coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80'],
      content: {
        speakers: [
          'Dr. Nguyen Van A - Nutrition Expert',
          'Pharmacist Tran Thi B - ADK Medical Director',
          'CEO Le Van C - ADK Pharma Founder',
        ],
        topics: [
          'Dietary Supplements: Smart Choices',
          'Diet for Chronic Disease Patients',
          'Integrating Modern Medicine and Traditional Medicine',
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
      question: 'Can I join without pharmacy business experience?',
      answer:
        'Absolutely! ADK provides comprehensive A-Z support, even for beginners. We have a team of experts for setup, training, and operations. The only requirement is that you need to have or hire a representative pharmacist.',
      sortOrder: 6,
      isVisible: true,
    },
    {
      question: 'What is the minimum premises size?',
      answer:
        'Minimum 40m² for basic model. Standard model from 60-80m², expanded model from 100m² and above. ADK provides design consulting optimized based on your actual premises.',
      sortOrder: 7,
      isVisible: true,
    },
    {
      question: 'What licenses are needed to open a pharmacy?',
      answer:
        'You need a Certificate of Pharmaceutical Business Eligibility (GPP) issued by the Provincial Health Department. ADK supports all documentation, legal procedures and accompanies you throughout the licensing process.',
      sortOrder: 8,
      isVisible: true,
    },
    {
      question: 'What are the franchise and monthly management fees?',
      answer:
        'Initial franchise fee: 50-100 million VND (one-time). System management fee: 2-3% of revenue/month, including: ERP, marketing, training, operational support.',
      sortOrder: 9,
      isVisible: true,
    },
    {
      question: 'Can I choose my own suppliers?',
      answer:
        'You can import additional products from your own suppliers, but must ensure quality and clear origin. However, importing from ADK warehouse will have better prices and marketing support.',
      sortOrder: 10,
      isVisible: true,
    },
    {
      question: 'Does ADK help find premises?',
      answer:
        'Yes. The ADK team has experience in business location consulting, local market analysis, and connecting with potential landlords in your area of interest.',
      sortOrder: 11,
      isVisible: true,
    },
    {
      question: 'What support is available if business is not effective?',
      answer:
        'ADK commits to long-term partnership. If you face difficulties, we will: (1) Analyze causes, (2) Adjust marketing strategy, (3) Provide operational consulting, (4) Organize demand-stimulating promotions.',
      sortOrder: 12,
      isVisible: true,
    },
    {
      question: 'How long is the partnership contract?',
      answer:
        'Franchise contract duration is 5 years, renewable. During the contract period, partners enjoy full rights and support from ADK.',
      sortOrder: 13,
      isVisible: true,
    },
    {
      question: 'Can I open multiple stores?',
      answer:
        'Yes. After the first store operates stably (6-12 months), ADK encourages expansion with franchise fee incentives and capital support for 2nd, 3rd stores.',
      sortOrder: 14,
      isVisible: true,
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
      layoutType: LayoutType.CAROUSEL,
      content: {
        title: 'Success Stories',
        subtitle: 'From our partners',
        cards: [
          {
            id: 1,
            name: 'Pharmacist Nguyen Thi Mai',
            location: 'ADK Pharmacy Binh Thanh',
            story:
              'From a 40m² pharmacy to a chain of 3 stores in 2 years. Monthly revenue reached 450 million.',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
            revenue: '450 million/month',
          },
          {
            id: 2,
            name: 'Mr. Tran Van Hung',
            location: 'ADK Healthy Hub Da Nang',
            story:
              'Converted from grocery store to ADK model. Income increased 3 times, serving 200+ customers/day.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
            revenue: '320 million/month',
          },
          {
            id: 3,
            name: 'Ms. Pham Thu Huong',
            location: 'ADK Fresh Mart Hanoi',
            story: 'ROI after 18 months. Loyal customers come from surrounding areas.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
            revenue: '280 million/month',
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
        title: 'Partnership Roadmap',
        subtitle: 'From idea to grand opening',
        steps: [
          {
            phase: 'Week 1-2',
            title: 'Consultation & Survey',
            description: 'Meet with experts, site survey, local market analysis',
          },
          {
            phase: 'Week 3',
            title: 'Contract Signing',
            description: 'Agree on terms, sign franchise contract, pay initial fee',
          },
          {
            phase: 'Week 4-5',
            title: 'Design & Preparation',
            description: '3D store design, license application, order equipment and products',
          },
          {
            phase: 'Week 6-9',
            title: 'Construction & Setup',
            description: 'Store construction, equipment installation, ERP system setup',
          },
          {
            phase: 'Week 10',
            title: 'Staff Training',
            description: 'Train pharmacists and staff on products, processes, systems',
          },
          {
            phase: 'Week 11',
            title: 'Grand Opening',
            description: 'Opening event, marketing campaign, first month operational support',
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
        title: 'Diverse Product Categories',
        subtitle: 'Over 5,000 SKUs from 200+ trusted brands',
        features: [
          {
            icon: 'pill',
            title: 'Prescription & OTC Medicines',
            description: '2,000+ SKUs from top pharmaceutical companies',
            stat: '40%',
          },
          {
            icon: 'heart',
            title: 'Dietary Supplements',
            description: 'Vitamins, minerals, herbal products',
            stat: '25%',
          },
          {
            icon: 'droplet',
            title: 'Cosmeceuticals',
            description: 'Skin and hair care from medical brands',
            stat: '15%',
          },
          {
            icon: 'leaf',
            title: 'Organic Food',
            description: 'Plant milk, cereals, clean food',
            stat: '10%',
          },
          {
            icon: 'baby',
            title: 'Mom & Baby',
            description: 'Formula milk, diapers, baby products',
            stat: '7%',
          },
          {
            icon: 'stethoscope',
            title: 'Medical Equipment',
            description: 'Blood pressure monitors, glucometers, thermometers',
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
        title: 'Operational Technology',
        subtitle: 'Comprehensive management system',
        leftColumn: {
          title: 'Management Software',
          items: [
            'Real-time inventory ERP',
            'POS with integrated payments',
            'Mobile app for staff',
            'Automatic e-invoicing',
          ],
        },
        rightColumn: {
          title: 'Marketing & CRM',
          items: [
            'Zalo OA, Facebook integration',
            'Automated SMS Marketing',
            'Customer loyalty program',
            'Real-time revenue reports',
          ],
        },
        bottomText: 'Save 30% operational time through automation',
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
        title: '24/7 Support Team',
        subtitle: 'Always ready to partner with you',
        items: [
          {
            id: 'tech',
            title: 'Technical Support',
            description: 'Resolve system and software issues within 2 hours',
            icon: 'headset',
            size: 'large',
          },
          {
            id: 'supply',
            title: 'Supply Management',
            description: 'Ordering advice, inventory optimization',
            icon: 'truck',
            size: 'medium',
          },
          {
            id: 'marketing',
            title: 'Marketing Specialist',
            description: 'Campaign support, content design',
            icon: 'megaphone',
            size: 'medium',
          },
          {
            id: 'training',
            title: 'Continuous Training',
            description: 'Monthly workshops, webinars on new products',
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
