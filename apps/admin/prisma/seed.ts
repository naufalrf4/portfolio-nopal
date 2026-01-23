import { config } from 'dotenv';
import { PrismaClient } from './generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { UserRole, ProjectContextType, SlotStatus, BookingStatus } from './generated/client/enums';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  console.log('👤 Creating users...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@naufalrf.tech' },
    update: {},
    create: {
      email: 'admin@naufalrf.tech',
      name: 'Naufal RF',
      role: UserRole.ADMIN,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: UserRole.USER,
    },
  });

  console.log('✅ Users created\n');

  console.log('📁 Creating projects...');
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { slug: 'portfolio-ecosystem' },
      update: {},
      create: {
        title: 'Portfolio Ecosystem',
        slug: 'portfolio-ecosystem',
        summary:
          'A comprehensive multi-app portfolio platform with CMS, public site, and AI chatbot',
        description:
          'Full-stack portfolio ecosystem featuring admin dashboard, public portfolio, links hub, anonymous messaging, and RAG-powered AI chatbot. Built with modern technologies and best practices.',
        content: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This project showcases a complete portfolio platform built with Next.js 15, featuring multiple interconnected applications.',
                },
              ],
            },
          ],
        }),
        category: 'Full-Stack',
        techStack: [
          'Next.js 15',
          'React 19',
          'TypeScript',
          'Tailwind CSS',
          'Prisma',
          'PostgreSQL',
          'Fastify',
          'LangChain',
          'NextAuth.js',
        ],
        liveUrl: 'https://naufalrf.tech',
        repoUrl: 'https://github.com/naufalrf/portfolio',
        featured: true,
        visible: true,
        order: 0,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'e-commerce-platform' },
      update: {},
      create: {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        summary: 'Modern e-commerce platform with real-time inventory and payment integration',
        description:
          'A scalable e-commerce solution featuring product management, shopping cart, checkout flow, and admin dashboard. Integrated with payment gateways and shipping providers.',
        category: 'Web',
        techStack: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'PostgreSQL', 'Redis'],
        featured: true,
        visible: true,
        order: 1,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'task-management-app' },
      update: {},
      create: {
        title: 'Task Management App',
        slug: 'task-management-app',
        summary: 'Collaborative task management with real-time updates',
        description:
          'Team collaboration tool with kanban boards, real-time updates, task assignments, and progress tracking.',
        category: 'Web',
        techStack: ['Next.js', 'Socket.io', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
        liveUrl: 'https://tasks.example.com',
        visible: true,
        order: 2,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'mobile-fitness-tracker' },
      update: {},
      create: {
        title: 'Mobile Fitness Tracker',
        slug: 'mobile-fitness-tracker',
        summary: 'Cross-platform fitness tracking mobile application',
        description:
          'Mobile app for tracking workouts, nutrition, and health metrics with social features and progress analytics.',
        category: 'Mobile',
        techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
        visible: true,
        order: 3,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'api-gateway-service' },
      update: {},
      create: {
        title: 'API Gateway Service',
        slug: 'api-gateway-service',
        summary: 'Microservices API gateway with rate limiting and authentication',
        description:
          'High-performance API gateway handling routing, authentication, rate limiting, and request transformation for microservices architecture.',
        category: 'Backend',
        techStack: ['Node.js', 'Express', 'Redis', 'Docker', 'Kong'],
        repoUrl: 'https://github.com/naufalrf/api-gateway',
        visible: true,
        order: 4,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'ai-content-generator' },
      update: {},
      create: {
        title: 'AI Content Generator',
        slug: 'ai-content-generator',
        summary: 'Machine learning powered content generation platform',
        description:
          'AI-powered platform for generating blog posts, social media content, and marketing copy using large language models.',
        category: 'AI',
        techStack: ['Python', 'FastAPI', 'OpenAI', 'PostgreSQL', 'Docker'],
        featured: false,
        visible: true,
        order: 5,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'blockchain-voting' },
      update: {},
      create: {
        title: 'Blockchain Voting System',
        slug: 'blockchain-voting',
        summary: 'Decentralized voting platform built on blockchain technology',
        description:
          'Secure and transparent voting system using blockchain technology for immutable vote records and verifiable results.',
        category: 'Blockchain',
        techStack: ['Solidity', 'React', 'Web3.js', 'Ethereum', 'IPFS'],
        featured: false,
        visible: true,
        order: 6,
      },
    }),
    prisma.project.upsert({
      where: { slug: 'devops-automation' },
      update: {},
      create: {
        title: 'DevOps Automation Pipeline',
        slug: 'devops-automation',
        summary: 'Infrastructure automation and CI/CD pipeline',
        description:
          'Comprehensive DevOps automation solution for infrastructure provisioning, deployment, and monitoring.',
        category: 'DevOps',
        techStack: ['Terraform', 'Kubernetes', 'AWS', 'Ansible', 'Jenkins'],
        repoUrl: 'https://github.com/naufalrf/devops-pipeline',
        featured: false,
        visible: false,
        order: 7,
      },
    }),
  ]);

  console.log('✅ Projects created\n');

  console.log('📝 Creating project contexts...');
  await prisma.projectContext.createMany({
    data: [
      {
        projectId: projects[0].id,
        type: ProjectContextType.CONTEXT,
        title: 'Project Overview',
        content:
          'This portfolio ecosystem demonstrates expertise in building scalable, maintainable applications using modern web technologies and architectural patterns.',
        order: 0,
      },
      {
        projectId: projects[0].id,
        type: ProjectContextType.ARCHITECTURE,
        title: 'System Architecture',
        content:
          'Monorepo structure with Turborepo, featuring 5 separate Next.js apps (admin, public, links, NGL, RAG) and shared packages for UI components, types, and utilities.',
        order: 1,
      },
      {
        projectId: projects[0].id,
        type: ProjectContextType.DECISIONS,
        title: 'Technical Decisions',
        content:
          'Chose Next.js 15 with App Router for better performance and developer experience. Prisma for type-safe database access. Neumorphic design for unique visual identity.',
        order: 2,
      },
      {
        projectId: projects[0].id,
        type: ProjectContextType.METRICS,
        title: 'Performance Metrics',
        content:
          'Achieved 95+ Lighthouse scores, sub-second page loads, and 99.9% uptime. Optimized bundle sizes and implemented caching strategies.',
        order: 3,
      },
      {
        projectId: projects[1].id,
        type: ProjectContextType.ROLE,
        title: 'My Role',
        content:
          'Led the development team, designed the architecture, implemented core features including shopping cart and payment integration.',
        order: 0,
      },
      {
        projectId: projects[1].id,
        type: ProjectContextType.RESULT,
        title: 'Results',
        content:
          'Launched in 6 months with 10,000+ users. Achieved $50,000+ in monthly revenue. Reduced cart abandonment by 30%.',
        order: 1,
      },
      {
        projectId: projects[2].id,
        type: ProjectContextType.TRADEOFFS,
        title: 'Technical Tradeoffs',
        content:
          'Chose MongoDB over PostgreSQL for schema flexibility. Used Socket.io for real-time despite WebSocket benefits. Compromised on initial UI polish for faster MVP.',
        order: 0,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Project contexts created\n');

  // Clear existing blog links
  await prisma.blogLink.deleteMany({});

  console.log('📰 Creating blog links...');
  await prisma.blogLink.deleteMany({});
  await prisma.blogLink.createMany({
    data: [
      {
        url: 'https://dev.to/naufalrf/building-modern-portfolio',
        title: 'Building a Modern Portfolio with Next.js 15',
        description:
          'A comprehensive guide to creating a portfolio using Next.js App Router and React Server Components',
        imageUrl: 'https://dev.to/assets/og-image.png',
        source: 'DEV.to',
        category: 'Engineering',
        tags: ['nextjs', 'react', 'tailwindcss'],
        publishedAt: new Date('2024-01-15T00:00:00.000Z'),
        visible: true,
        order: 0,
      },
      {
        url: 'https://medium.com/@naufalrf/mastering-typescript-generics',
        title: 'Mastering TypeScript Generics: A Practical Guide',
        description:
          'Learn how to leverage TypeScript generics to write reusable and type-safe code',
        imageUrl: 'https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png',
        source: 'Medium',
        category: 'Engineering',
        tags: ['typescript', 'programming'],
        publishedAt: new Date('2024-02-01T00:00:00.000Z'),
        visible: true,
        order: 1,
      },
      {
        url: 'https://hashnode.com/@naufalrf/serverless-architecture-patterns',
        title: 'Serverless Architecture Patterns for Scalable Apps',
        description: 'Exploring common serverless patterns using AWS Lambda and API Gateway',
        imageUrl: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1612423456789/sample.png',
        source: 'Hashnode',
        category: 'Cloud',
        tags: ['aws', 'serverless', 'architecture'],
        publishedAt: new Date('2024-02-20T00:00:00.000Z'),
        visible: true,
        order: 2,
      },
    ],
  });

  const blogLinks = await prisma.blogLink.findMany();
  console.log('✅ Blog links created\n');

  console.log('✅ Profile links created\n');

  console.log('👋 Creating guestbook entries...');
  await Promise.all([
    prisma.guestbookEntry.create({
      data: {
        userId: demoUser.id,
        message: 'Amazing portfolio! Love the neumorphic design 🎨',
        reactions: JSON.stringify([
          { emoji: '👍', count: 5 },
          { emoji: '❤️', count: 3 },
        ]),
        visible: true,
      },
    }),
    prisma.guestbookEntry.create({
      data: {
        userId: demoUser.id,
        message: 'Great work on the admin dashboard! Very clean and intuitive.',
        reactions: JSON.stringify([{ emoji: '🔥', count: 2 }]),
        visible: true,
      },
    }),
    prisma.guestbookEntry.create({
      data: {
        userId: adminUser.id,
        message:
          'Thanks everyone for visiting my portfolio! Feel free to reach out if you have any questions.',
        reactions: JSON.stringify([{ emoji: '🎉', count: 8 }]),
        visible: true,
      },
    }),
  ]);

  console.log('✅ Guestbook entries created\n');

  console.log('💬 Creating anonymous messages...');
  await prisma.anonymousMessage.createMany({
    data: [
      {
        content: 'Your projects are very inspiring! Keep up the great work.',
        ipHash: 'hash_192_168_1_1',
        ipAddress: '192.168.1.1',
        countryCode: 'US',
        country: 'United States',
        city: 'New York',
        region: 'New York',
        read: false,
        createdAt: new Date(),
      },
      {
        content:
          'Would love to collaborate on a project sometime. Your tech stack looks impressive.',
        ipHash: 'hash_45_33_22_11',
        ipAddress: '45.33.22.11',
        countryCode: 'US',
        country: 'United States',
        city: 'San Francisco',
        region: 'California',
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'Salam dari Indonesia! Portofolio yang sangat bagus.',
        ipHash: 'hash_103_21_244_5',
        ipAddress: '103.21.244.5',
        countryCode: 'ID',
        country: 'Indonesia',
        city: 'Jakarta',
        region: 'DKI Jakarta',
        read: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'The AI chatbot feature is really cool! How did you implement it?',
        ipHash: 'hash_80_98_42_89',
        ipAddress: '80.98.42.89',
        countryCode: 'UK',
        country: 'United Kingdom',
        city: 'London',
        region: 'England',
        read: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'Great work on the portfolio ecosystem. Very well structured.',
        ipHash: 'hash_114_125_14_20',
        ipAddress: '114.125.14.20',
        countryCode: 'ID',
        country: 'Indonesia',
        city: 'Bandung',
        region: 'West Java',
        read: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'Your coding style is clean and professional. Keep it up!',
        ipHash: 'hash_165_21_83_5',
        ipAddress: '165.21.83.5',
        countryCode: 'SG',
        country: 'Singapore',
        city: 'Singapore',
        region: null,
        read: true,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'Would you be interested in a freelance project? Let me know.',
        ipHash: 'hash_175_156_12_55',
        ipAddress: '175.156.12.55',
        countryCode: 'MY',
        country: 'Malaysia',
        city: 'Kuala Lumpur',
        region: 'Kuala Lumpur',
        read: false,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'The neumorphic design is really unique. Nice touch!',
        ipHash: 'hash_54_179_48_2',
        ipAddress: '54.179.48.2',
        countryCode: 'SG',
        country: 'Singapore',
        city: 'Singapore',
        region: null,
        read: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'I learned so much from your blog posts. Thanks for sharing!',
        ipHash: 'hash_86_152_48_90',
        ipAddress: '86.152.48.90',
        countryCode: 'UK',
        country: 'United Kingdom',
        city: 'Manchester',
        region: 'England',
        read: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        content: 'Looking forward to seeing more projects from you.',
        ipHash: 'hash_172_56_42_10',
        ipAddress: '172.56.42.10',
        countryCode: 'US',
        country: 'United States',
        city: 'Los Angeles',
        region: 'California',
        read: false,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Anonymous messages created\n');

  console.log('📊 Creating analytics events...');
  const pages = [
    '/',
    '/projects',
    '/projects/portfolio-ecosystem',
    '/blogs',
    '/links',
    '/about',
    '/contact',
  ];
  const eventTypes = ['pageview', 'click', 'scroll', 'form_submit', 'project_view', 'blog_click'];
  const ips = [
    '192.168.1.1',
    '45.33.22.11',
    '103.21.244.5',
    '80.98.42.89',
    '114.125.14.20',
    '165.21.83.5',
    '175.156.12.55',
    '54.179.48.2',
  ];
  const countryCodes = ['US', 'US', 'ID', 'UK', 'ID', 'SG', 'MY', 'SG'];
  const countries = [
    'United States',
    'United States',
    'Indonesia',
    'United Kingdom',
    'Indonesia',
    'Singapore',
    'Malaysia',
    'Singapore',
  ];
  const cities = [
    'New York',
    'San Francisco',
    'Jakarta',
    'London',
    'Bandung',
    'Singapore',
    'Kuala Lumpur',
    'Singapore',
  ];

  const analyticsData = [];
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() - daysAgo);
    eventDate.setHours(hoursAgo, minutesAgo, 0, 0);

    const ipIndex = Math.floor(Math.random() * ips.length);
    const pageIndex = Math.floor(Math.random() * pages.length);
    const eventTypeIndex = Math.floor(Math.random() * eventTypes.length);

    const eventData = {
      page: pages[pageIndex],
      entityType: eventTypeIndex < 4 ? '' : eventTypeIndex === 4 ? 'project' : 'blog',
      entityId:
        eventTypeIndex < 4 ? undefined : eventTypeIndex === 4 ? projects[0].id : blogLinks[0].id,
      eventType: eventTypes[eventTypeIndex],
      data: eventTypeIndex === 3 ? { formType: 'contact' } : undefined,
      userSession: `session_${Math.random().toString(36).substring(2, 15)}`,
      ipAddress: ips[ipIndex],
      countryCode: countryCodes[ipIndex],
      city: cities[ipIndex],
      createdAt: eventDate,
    };
    analyticsData.push(eventData);
  }

  await prisma.analyticsEvent.createMany({
    data: analyticsData,
  });

  console.log('✅ Analytics events created\n');

  console.log('📧 Creating contact form submissions...');
  await prisma.contactForm.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'Hi, I would like to discuss a potential project collaboration.',
        ipHash: 'contact_hash_1',
        read: false,
        replied: false,
        createdAt: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Job Opportunity',
        message: 'We have an exciting opportunity at our company. Would you be interested?',
        ipHash: 'contact_hash_2',
        read: true,
        replied: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Ahmad Wijaya',
        email: 'ahmad@company.id',
        subject: 'Freelance Project',
        message: 'Need help building a modern web application. Can we schedule a call?',
        ipHash: 'contact_hash_3',
        read: false,
        replied: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@startup.co.uk',
        subject: 'Tech Partnership',
        message: 'Our startup is looking for technical partners. Your portfolio looks impressive.',
        ipHash: 'contact_hash_4',
        read: true,
        replied: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Michael Tan',
        email: 'michael@enterprise.sg',
        subject: 'Consultation Request',
        message: 'Interested in your expertise for a large-scale project.',
        ipHash: 'contact_hash_5',
        read: true,
        replied: false,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Contact forms created\n');

  console.log('👨‍💼 Creating about me...');
  await prisma.aboutMe.upsert({
    where: { id: 'about-main' },
    update: {},
    create: {
      id: 'about-main',
      fullName: 'Naufal RF',
      tagline: 'Full-Stack Engineer & Tech Enthusiast',
      roles: ['Full-Stack Developer', 'Tech Lead', 'Open Source Contributor', 'System Architect'],
      bio: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in modern JavaScript/TypeScript ecosystems and cloud-native architectures.',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'I love creating elegant solutions to complex problems and contributing to open source projects. When not coding, you can find me writing technical blogs or exploring new technologies.',
              },
            ],
          },
        ],
      }),
      email: 'hello@naufalrf.tech',
      phone: '+62 812-3456-7890',
      location: 'Jakarta, Indonesia',
      skills: [
        'Next.js',
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Prisma',
        'Tailwind CSS',
        'Docker',
        'AWS',
        'Redis',
        'GraphQL',
        'Microservices',
      ],
      experience: [
        {
          type: 'Work',
          title: 'Senior Full-Stack Engineer',
          organization: 'Tech Startup Inc.',
          location: 'Jakarta, Indonesia',
          startDate: '2022-01',
          endDate: null,
          description:
            'Leading development of modern web applications using Next.js and TypeScript. Architected microservices infrastructure handling 1M+ daily requests.',
        },
        {
          type: 'Work',
          title: 'Full-Stack Developer',
          organization: 'Digital Agency Co.',
          location: 'Jakarta, Indonesia',
          startDate: '2020-03',
          endDate: '2021-12',
          description:
            'Developed client projects using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and improved deployment processes.',
        },
        {
          type: 'Education',
          title: 'Bachelor of Computer Science',
          organization: 'University of Indonesia',
          location: 'Jakarta, Indonesia',
          startDate: '2018-08',
          endDate: '2022-06',
          description:
            'Graduated with honors (GPA 3.8/4.0). Focus on software engineering, algorithms, and distributed systems.',
        },
      ],
      socialLinks: {
        github: 'https://github.com/naufalrf',
        linkedin: 'https://linkedin.com/in/naufalrf',
        twitter: 'https://twitter.com/naufalrf',
        instagram: 'https://instagram.com/naufalrf',
      },
    },
  });

  console.log('✅ About me created\n');

  console.log('⚙️ Creating settings...');
  await prisma.contactSettings.upsert({
    where: { id: 'settings-main' },
    update: {},
    create: {
      id: 'settings-main',
      notificationEmail: 'hello@naufalrf.tech',
      blockedKeywords: ['spam', 'viagra', 'casino', 'crypto', 'forex'],
    },
  });

  await prisma.bookingSettings.upsert({
    where: { id: 'booking-settings-main' },
    update: {},
    create: {
      id: 'booking-settings-main',
      notificationEmail: 'hello@naufalrf.tech',
      reminderEnabled: true,
      reminderDay: 6,
      reminderTime: '09:00',
      timezone: 'Asia/Jakarta',
    },
  });

  console.log('✅ Settings created\n');

  console.log('📅 Creating booking slots...');
  const today = new Date();
  const slots = [];

  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);

    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    for (const time of times) {
      slots.push({
        date,
        time,
        duration: 60,
        status: SlotStatus.AVAILABLE,
      });
    }
  }

  await prisma.bookingSlot.createMany({
    data: slots,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${slots.length} booking slots\n`);

  console.log('🎯 Creating sample bookings...');
  const availableSlots = await prisma.bookingSlot.findMany({
    where: { status: SlotStatus.AVAILABLE },
    take: 5,
    orderBy: { date: 'asc' },
  });

  if (availableSlots.length >= 3) {
    await prisma.booking.deleteMany({});

    await prisma.booking.create({
      data: {
        slotId: availableSlots[0].id,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+62 812-1111-2222',
        notes:
          'I would like to discuss a potential web development project for our startup at Tech Innovations Ltd. Purpose: Project Consultation',
        ipHash: 'booking-hash-1',
        status: BookingStatus.CONFIRMED,
      },
    });

    await prisma.booking.create({
      data: {
        slotId: availableSlots[1].id,
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+62 813-3333-4444',
        notes:
          'Looking forward to discussing the senior developer position. Purpose: Technical Interview',
        ipHash: 'booking-hash-2',
        status: BookingStatus.PENDING,
      },
    });

    await prisma.booking.create({
      data: {
        slotId: availableSlots[2].id,
        name: 'Carol Davis',
        email: 'carol@example.com',
        phone: '+62 814-5555-6666',
        notes:
          'Want to explore potential collaboration opportunities with Digital Agency Co. Purpose: Collaboration Discussion',
        ipHash: 'booking-hash-3',
        status: BookingStatus.CANCELLED,
      },
    });

    await prisma.bookingSlot.update({
      where: { id: availableSlots[0].id },
      data: { status: SlotStatus.BOOKED },
    });

    await prisma.bookingSlot.update({
      where: { id: availableSlots[1].id },
      data: { status: SlotStatus.BOOKED },
    });
  }

  console.log('✅ Sample bookings created\n');

  console.log('🕐 Creating booking availability...');
  await prisma.bookingAvailability.createMany({
    data: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', enabled: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', enabled: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', enabled: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', enabled: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', enabled: true },
      { dayOfWeek: 6, startTime: '10:00', endTime: '14:00', enabled: false },
      { dayOfWeek: 0, startTime: '10:00', endTime: '14:00', enabled: false },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Booking availability created\n');

  console.log('📚 Creating knowledge docs...');
  await prisma.knowledgeDoc.createMany({
    data: [
      {
        filename: 'portfolio-overview.md',
        content: `# Portfolio Ecosystem Overview

This is a comprehensive portfolio platform built with modern web technologies.

## Features
- Admin CMS Dashboard
- Public Portfolio Site
- Links Hub
- Anonymous Messaging
- RAG-powered AI Chatbot

## Tech Stack
- Next.js 15
- React 19
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS
- Fastify (RAG Service)`,
        indexed: true,
      },
      {
        filename: 'architecture.md',
        content: `# System Architecture

Monorepo structure using Turborepo with workspace packages.

## Apps
1. admin - CMS dashboard
2. public - Portfolio website
3. links - Links hub
4. ngl - Anonymous messaging
5. rag-service - AI chatbot (Fastify)

## Packages
- ui - Shared UI components
- types - Shared TypeScript types
- sdk - API client SDK
- config - Shared configs
- auth - NextAuth setup`,
        indexed: true,
      },
      {
        filename: 'prisma-best-practices.md',
        content:
          'Prisma Best Practices\n\nQuery Optimization\n\nUse select instead of include when possible for better performance.\n\nIndexing Strategy\n\nAlways add indexes for frequently queried fields.',
        indexed: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Knowledge docs created\n');

  console.log('💬 Creating chat logs...');
  await prisma.chatLog.createMany({
    data: [
      {
        sessionId: 'session_abc123',
        messages: JSON.stringify([
          { role: 'user', content: 'What projects have you worked on?' },
          {
            role: 'assistant',
            content:
              'I have worked on several projects including Portfolio Ecosystem, E-Commerce Platform, Task Management App, and more. You can view all projects on the projects page.',
          },
        ]),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        sessionId: 'session_def456',
        messages: JSON.stringify([
          { role: 'user', content: 'Tell me about your tech stack.' },
          {
            role: 'assistant',
            content:
              'My primary tech stack includes Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS, Docker, AWS, and Redis. I also have experience with GraphQL and microservices.',
          },
        ]),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        sessionId: 'session_ghi789',
        messages: JSON.stringify([
          { role: 'user', content: 'How can I contact you?' },
          {
            role: 'assistant',
            content:
              "You can contact me through the contact form on this website, or reach out via email at hello@naufalrf.tech. I'm also available for booking consultations through the calendar.",
          },
        ]),
        createdAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Chat logs created\n');

  console.log('\n🎉 Comprehensive seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Projects: ${await prisma.project.count()}`);
  console.log(`   - Project Contexts: ${await prisma.projectContext.count()}`);
  console.log(`   - Blog Links: ${await prisma.blogLink.count()}`);
  console.log(`   - Profile Links: ${await prisma.profileLink.count()}`);
  console.log(`   - Guestbook Entries: ${await prisma.guestbookEntry.count()}`);
  console.log(`   - Anonymous Messages: ${await prisma.anonymousMessage.count()}`);
  console.log(`   - Analytics Events: ${await prisma.analyticsEvent.count()}`);
  console.log(`   - Contact Forms: ${await prisma.contactForm.count()}`);
  console.log(`   - Booking Slots: ${await prisma.bookingSlot.count()}`);
  console.log(`   - Bookings: ${await prisma.booking.count()}`);
  console.log(`   - Knowledge Docs: ${await prisma.knowledgeDoc.count()}`);
  console.log(`   - Chat Logs: ${await prisma.chatLog.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
