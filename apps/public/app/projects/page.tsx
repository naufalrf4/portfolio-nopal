import type { Metadata } from 'next';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectGrid } from '@/components/projects/ProjectGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web applications, mobile apps, and backend systems',
  openGraph: {
    title: 'Projects | NaufalRF',
    description: 'Explore my portfolio of web applications, mobile apps, and backend systems',
    type: 'website',
  },
};

const mockProjects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    summary: 'Full-stack marketplace with real-time inventory management',
    description: 'A comprehensive e-commerce solution...',
    category: 'web',
    techStack: ['Next.js', 'PostgreSQL', 'Redis', 'Stripe'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/user/repo',
    imageUrl: '/placeholder.jpg',
    featured: true,
    visible: true,
    order: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Mobile Fitness App',
    slug: 'fitness-tracker',
    summary: 'Cross-platform fitness tracking application with AI coaching',
    description: 'Mobile app for tracking workouts...',
    category: 'mobile',
    techStack: ['React Native', 'Node.js', 'MongoDB', 'TensorFlow'],
    liveUrl: 'https://example.com',
    imageUrl: '/placeholder.jpg',
    featured: true,
    visible: true,
    order: 2,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    title: 'Microservices Backend',
    slug: 'microservices-api',
    summary: 'Scalable microservices architecture for enterprise applications',
    description: 'Backend system with multiple microservices...',
    category: 'backend',
    techStack: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL'],
    repoUrl: 'https://github.com/user/repo',
    imageUrl: '/placeholder.jpg',
    featured: false,
    visible: true,
    order: 3,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

async function getProjects() {
  try {
    const response = await defaultClient.projects.getAll();
    const projects = response.data?.projects || [];
    return projects.length > 0 ? projects : mockProjects;
  } catch {
    return mockProjects;
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const serializedProjects = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A collection of projects showcasing my skills in web development, mobile applications,
            backend systems, and DevOps practices.
          </p>
        </div>

        <ProjectGrid projects={serializedProjects as any} />
      </div>
    </div>
  );
}
