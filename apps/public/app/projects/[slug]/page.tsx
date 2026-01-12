import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectDetail } from '@/src/features/projects/components';
import { ProjectViewTracker } from '@/src/components/projects/ProjectViewTracker';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const MOCK_PROJECT_DETAIL = {
  id: '1',
  title: 'E-Commerce Platform',
  slug: 'ecommerce-platform',
  summary:
    'Full-stack marketplace with real-time inventory management and secure payment processing',
  description: `This project is a comprehensive e-commerce solution built with modern web technologies.

The platform handles thousands of concurrent users and processes real-time inventory updates across multiple warehouses.

Key features include user authentication, product catalog, shopping cart, secure payment processing, order management, and admin dashboard.

The architecture follows microservices principles with separate services for user management, product catalog, order processing, and payment handling.`,
  category: 'web',
  techStack: ['Next.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker', 'AWS'],
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/user/repo',
  imageUrl: '',
  featured: true,
  visible: true,
  order: 1,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  contexts: [
    {
      id: '1',
      projectId: '1',
      type: 'CONTEXT' as const,
      title: 'Background',
      content:
        'The client needed a scalable e-commerce platform that could handle high traffic during peak shopping seasons. The existing legacy system was monolithic and difficult to maintain, leading to frequent outages and slow feature development.',
      order: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      projectId: '1',
      type: 'ROLE' as const,
      title: 'My Responsibilities',
      content:
        'As the lead developer, I architected the entire system, implemented the core features, set up CI/CD pipelines, and mentored junior developers on best practices. I was responsible for technical decisions and ensuring code quality across the team.',
      order: 2,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      projectId: '1',
      type: 'ARCHITECTURE' as const,
      title: 'System Design',
      content:
        'Built using a microservices architecture with Next.js frontend, Node.js backend services, PostgreSQL for relational data, Redis for caching and session management, and AWS for hosting. Implemented event-driven architecture for real-time inventory updates using message queues.',
      order: 3,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '4',
      projectId: '1',
      type: 'RESULT' as const,
      title: 'Outcomes',
      content:
        'Successfully launched platform handling 50k+ daily active users, reduced page load times by 60%, improved conversion rate by 35%, and maintained 99.9% uptime. The new architecture reduced deployment time from hours to minutes.',
      order: 4,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ],
};

async function getProject(slug: string) {
  try {
    const response = await defaultClient.projects.getBySlug(slug);
    if (response.data) return response.data;
    if (slug === 'ecommerce-platform') return MOCK_PROJECT_DETAIL;
    return null;
  } catch {
    if (slug === 'ecommerce-platform') return MOCK_PROJECT_DETAIL;
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const title = project.title;
  const description = project.summary;
  const url = `https://naufalrf.tech/projects/${project.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | NaufalRF`,
      description,
      type: 'article',
      url,
      images: project.imageUrl
        ? [
            {
              url: project.imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | NaufalRF`,
      description,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const serializedProject = {
    ...project,
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
    contexts: project.contexts?.map((ctx) => ({
      ...ctx,
      createdAt: ctx.createdAt instanceof Date ? ctx.createdAt : new Date(ctx.createdAt),
      updatedAt: ctx.updatedAt instanceof Date ? ctx.updatedAt : new Date(ctx.updatedAt),
    })),
  };

  return (
    <>
      <ProjectViewTracker projectId={project.id} slug={project.slug} />
      <ProjectDetail project={serializedProject} />
    </>
  );
}
