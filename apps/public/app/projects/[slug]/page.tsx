import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { ProjectViewTracker } from '@/components/projects/ProjectViewTracker';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const mockProjectDetail = {
  id: '1',
  title: 'E-Commerce Platform',
  slug: 'ecommerce-platform',
  summary: 'Full-stack marketplace with real-time inventory management',
  description: `This project is a comprehensive e-commerce solution built with modern web technologies.

The platform handles thousands of concurrent users and processes real-time inventory updates across multiple warehouses.

Key features include user authentication, product catalog, shopping cart, secure payment processing, order management, and admin dashboard.`,
  category: 'web',
  techStack: ['Next.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker', 'AWS'],
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/user/repo',
  imageUrl: '/placeholder.jpg',
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
        'The client needed a scalable e-commerce platform that could handle high traffic during peak shopping seasons. The existing legacy system was monolithic and difficult to maintain.',
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
        'As the lead developer, I architected the entire system, implemented the core features, set up CI/CD pipelines, and mentored junior developers on best practices.',
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
        'Built using a microservices architecture with Next.js frontend, Node.js backend services, PostgreSQL for relational data, Redis for caching, and AWS for hosting. Implemented event-driven architecture for real-time updates.',
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
        'Successfully launched platform handling 50k+ daily active users, reduced page load times by 60%, improved conversion rate by 35%, and maintained 99.9% uptime.',
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
    if (slug === 'ecommerce-platform') return mockProjectDetail;
    return null;
  } catch {
    if (slug === 'ecommerce-platform') return mockProjectDetail;
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      images: project.imageUrl ? [project.imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectViewTracker projectId={project.id} projectTitle={project.title} />
      <ProjectDetail project={project} />
    </>
  );
}
