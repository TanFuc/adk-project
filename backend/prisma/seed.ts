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
        tagline: 'Pharmacy & Health Food Supermarket Model - 2025 Trend'
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
      description: 'Golden opportunity to become a strategic partner of ADK Pharmacy Supermarket chain. Learn about business model, expected ROI and partnership process.',
      startDate: new Date('2025-02-15T08:00:00Z'),
      endDate: new Date('2025-02-15T17:00:00Z'),
      coverImage: '/images/events/investment-seminar.jpg',
      gallery: [
        '/images/events/seminar-1.jpg',
        '/images/events/seminar-2.jpg',
      ],
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
      description: 'Event welcoming new partners joining the ADK system. Experience sharing from successful pharmacies.',
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
      description: 'In-depth training on operational processes, inventory management, and technology application in pharmacies.',
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
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // 4. Business Models
  console.log('Creating B2B business models...');
  const businessModels = [
    {
      name: 'Diverse Revenue Streams',
      description: 'Optimize profits from GPP pharmacy and health food. Gross profit margin 25-40% depending on product category. Not dependent on a single revenue source.',
      iconUrl: '/images/icons/revenue.svg',
      profitPotential: '25-40%',
      sortOrder: 0,
      isVisible: true,
    },
    {
      name: 'Automated Operations',
      description: 'Integrated ERP inventory management, sales app, and e-invoicing. Save on staffing costs and operational time.',
      iconUrl: '/images/icons/automation.svg',
      profitPotential: 'Save 30%',
      sortOrder: 1,
      isVisible: true,
    },
    {
      name: 'Proactive Supply Chain',
      description: 'Direct connection to factories & ingredient sources. Factory prices, no middlemen, on-time delivery. Support for slow-moving inventory returns.',
      iconUrl: '/images/icons/supply-chain.svg',
      profitPotential: 'Best prices',
      sortOrder: 2,
      isVisible: true,
    },
    {
      name: 'Trusted Brand',
      description: 'Unified, professional brand identity system. Trusted by customers with over 10 years in the industry.',
      iconUrl: '/images/icons/brand.svg',
      profitPotential: '10+ years trust',
      sortOrder: 3,
      isVisible: true,
    },
    {
      name: 'Capital Support',
      description: 'Initial inventory funding, first month operating costs covered. Reduce financial pressure for new partners.',
      iconUrl: '/images/icons/funding.svg',
      profitPotential: '50% support',
      sortOrder: 4,
      isVisible: true,
    },
    {
      name: 'Turnkey Setup',
      description: 'Store design and construction from A-Z. Handover in 30-45 days, ready to operate upon opening.',
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
      answer: 'Flexible investment from 500 million - 2 billion VND depending on premises size (40-100m²). Contact us for a detailed estimate tailored to your conditions.',
      sortOrder: 0,
      isVisible: true,
    },
    {
      question: 'How does ADK support product supply?',
      answer: 'Standardized product catalog including medicines, supplements, health food and OCOP products. Best prices from central warehouse, regular delivery, slow-moving inventory return support.',
      sortOrder: 1,
      isVisible: true,
    },
    {
      question: 'Will I receive staff training?',
      answer: 'Yes. ADK provides comprehensive training for pharmacists and staff on: Retail skills, Nutrition consulting, ERP system usage, and GPP standard operating procedures.',
      sortOrder: 2,
      isVisible: true,
    },
    {
      question: 'What is the expected payback period?',
      answer: 'With a good location and proper operations, average payback period is 18-24 months. Average monthly revenue 300-500 million VND depending on scale.',
      sortOrder: 3,
      isVisible: true,
    },
    {
      question: 'How does ADK support marketing?',
      answer: 'Omnichannel marketing support: Shared fanpage, local SEO, system-wide promotions, ready-made marketing materials. Marketing costs shared across the system.',
      sortOrder: 4,
      isVisible: true,
    },
    {
      question: 'What is the partnership process?',
      answer: '5-step process: (1) Register for consultation → (2) Site survey → (3) Sign contract → (4) Store setup (30-45 days) → (5) Grand opening and operations.',
      sortOrder: 5,
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
        description: 'In 2025, consumers shift from "Treatment" to "Proactive Healthcare". The ADK model solves this with a perfect combination of GPP Pharmacy and Health Food Supermarket.',
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
          items: ['Prescription & OTC medicines', 'Dietary supplements', 'Authentic cosmeceuticals'],
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
            description: 'Optimize profits from pharmacy and health food. Not dependent on single revenue source.',
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
            description: 'Direct connection to factories & ingredient sources. Factory prices, no middlemen.',
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
      description: 'Flexible investment from 500 million - 2 billion VND depending on premises size (40-100m²). Contact us for a detailed estimate tailored to your conditions.',
      content: { category: 'investment' },
      sortOrder: 0,
    },
    {
      type: ContentType.FAQ,
      title: 'How does ADK support product supply?',
      description: 'Standardized product catalog including medicines, supplements, health food and OCOP products. Best prices from central warehouse, regular delivery, slow-moving inventory return support.',
      content: { category: 'supply' },
      sortOrder: 1,
    },
    {
      type: ContentType.FAQ,
      title: 'Will I receive staff training?',
      description: 'Yes. ADK provides comprehensive training for pharmacists and staff on: Retail skills, Nutrition consulting, ERP system usage, and GPP standard operating procedures.',
      content: { category: 'training' },
      sortOrder: 2,
    },
    {
      type: ContentType.FAQ,
      title: 'What is the expected payback period?',
      description: 'With a good location and proper operations, average payback period is 18-24 months. Average monthly revenue 300-500 million VND depending on scale.',
      content: { category: 'roi' },
      sortOrder: 3,
    },
    {
      type: ContentType.FAQ,
      title: 'How does ADK support marketing?',
      description: 'Omnichannel marketing support: Shared fanpage, local SEO, system-wide promotions, ready-made marketing materials. Marketing costs shared across the system.',
      content: { category: 'marketing' },
      sortOrder: 4,
    },
    {
      type: ContentType.FAQ,
      title: 'What is the partnership process?',
      description: '5-step process: (1) Register for consultation → (2) Site survey → (3) Sign contract → (4) Store setup (30-45 days) → (5) Grand opening and operations.',
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
      description: 'Optimize profits from GPP pharmacy and health food. Gross profit margin 25-40% depending on product category.',
      content: { icon: 'trending-up' },
      sortOrder: 0,
    },
    {
      type: ContentType.FEATURE,
      title: 'Automated Operations',
      description: 'Integrated ERP inventory management, sales app, and e-invoicing. Save on staffing costs.',
      content: { icon: 'cpu' },
      sortOrder: 1,
    },
    {
      type: ContentType.FEATURE,
      title: 'Proactive Supply Chain',
      description: 'Direct connection to factories & ingredient sources. Factory prices, no middlemen, on-time delivery.',
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
      description: 'Initial inventory funding, first month operating costs covered. Reduce financial pressure.',
      content: { icon: 'wallet' },
      sortOrder: 4,
    },
    {
      type: ContentType.FEATURE,
      title: 'Turnkey Setup',
      description: 'Store design and construction from A-Z. Handover in 30-45 days, ready to operate.',
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
  .catch((e) => {
    console.error('Seed data error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
