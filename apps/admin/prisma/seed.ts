import 'dotenv/config';
import { PrismaClient } from './generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { UserRole, ProjectContextType } from './generated/client/enums';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@naufalrf.tech' },
    update: {},
    create: {
      email: 'admin@naufalrf.tech',
      name: 'NaufalRF',
      role: UserRole.ADMIN,
    },
  });

  const project = await prisma.project.upsert({
    where: { slug: 'portfolio-ecosystem' },
    update: {},
    create: {
      title: 'Portfolio Ecosystem',
      slug: 'portfolio-ecosystem',
      summary: 'A comprehensive multi-app portfolio platform',
      description:
        'Full-stack portfolio ecosystem with admin CMS, public portfolio, links hub, anonymous feedback, and AI chatbot.',
      category: 'Full-Stack',
      techStack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Prisma',
        'PostgreSQL',
        'Fastify',
        'LangChain',
      ],
      featured: true,
      visible: true,
      order: 0,
    },
  });

  await prisma.projectContext.upsert({
    where: { id: 'ctx-portfolio-overview' },
    update: {},
    create: {
      id: 'ctx-portfolio-overview',
      projectId: project.id,
      type: ProjectContextType.CONTEXT,
      title: 'Project Overview',
      content:
        'This portfolio ecosystem demonstrates expertise in building scalable, maintainable applications using modern web technologies.',
      order: 0,
    },
  });

  await prisma.blogLink.upsert({
    where: { url: 'https://dev.to/naufalrf' },
    update: {},
    create: {
      url: 'https://dev.to/naufalrf',
      title: 'Building a Modern Portfolio with Next.js',
      description: 'A guide to creating a portfolio using Next.js App Router',
      source: 'DEV.to',
      visible: true,
      order: 0,
    },
  });

  await prisma.profileLink.upsert({
    where: { id: 'link-github' },
    update: {},
    create: {
      id: 'link-github',
      label: 'GitHub',
      url: 'https://github.com/naufalrf',
      icon: 'github',
      visible: true,
      order: 0,
    },
  });

  await prisma.profileLink.upsert({
    where: { id: 'link-linkedin' },
    update: {},
    create: {
      id: 'link-linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/naufalrf',
      icon: 'linkedin',
      visible: true,
      order: 1,
    },
  });

  console.log('Seed completed:', { adminUser, project });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
