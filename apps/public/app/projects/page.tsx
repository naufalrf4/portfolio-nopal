import type { Metadata } from 'next';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectsGrid } from '@/src/features/projects/components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web applications, mobile apps, backend systems, and DevOps projects showcasing modern development practices.',
  openGraph: {
    title: 'Projects | NaufalRF',
    description:
      'Explore my portfolio of web applications, mobile apps, backend systems, and DevOps projects.',
    type: 'website',
    url: 'https://naufalrf.tech/projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | NaufalRF',
    description:
      'Explore my portfolio of web applications, mobile apps, backend systems, and DevOps projects.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/projects',
  },
};

const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    summary:
      'Full-stack marketplace with real-time inventory management and secure payment processing',
    description: `This project is a comprehensive e-commerce solution built with modern web technologies.

The platform handles thousands of concurrent users and processes real-time inventory updates across multiple warehouses.

Key features include user authentication, product catalog, shopping cart, secure payment processing, order management, and admin dashboard.`,
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
  },
  {
    id: '2',
    title: 'Mobile Fitness App',
    slug: 'fitness-tracker',
    summary:
      'Cross-platform fitness tracking application with AI-powered coaching and workout analytics',
    description: 'Mobile app for tracking workouts with AI coaching features.',
    category: 'mobile',
    techStack: ['React Native', 'Node.js', 'MongoDB', 'TensorFlow'],
    liveUrl: 'https://example.com',
    imageUrl: '',
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
    summary:
      'Scalable microservices architecture for enterprise applications with gRPC communication',
    description: 'Backend system with multiple microservices handling high-throughput workloads.',
    category: 'backend',
    techStack: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis'],
    repoUrl: 'https://github.com/user/repo',
    imageUrl: '',
    featured: false,
    visible: true,
    order: 3,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    title: 'CI/CD Pipeline Infrastructure',
    slug: 'cicd-pipeline',
    summary: 'Automated deployment pipeline with comprehensive testing and monitoring',
    description:
      'End-to-end CI/CD infrastructure with automated testing, staging, and production deployments.',
    category: 'devops',
    techStack: ['GitHub Actions', 'Terraform', 'AWS', 'Docker', 'Prometheus'],
    repoUrl: 'https://github.com/user/cicd',
    imageUrl: '',
    featured: false,
    visible: true,
    order: 4,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-04-20'),
  },
];

async function getProjects() {
  try {
    const response = await defaultClient.projects.getAll();
    const projects = response.data?.projects || [];
    return projects.length > 0 ? projects : MOCK_PROJECTS;
  } catch {
    return MOCK_PROJECTS;
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const serializedProjects = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
  }));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Projects
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A collection of projects showcasing my expertise in web development, mobile
            applications, backend systems, and DevOps practices. Each project represents real-world
            problem-solving and technical innovation.
          </p>
        </header>

        <ProjectsGrid projects={serializedProjects} />
      </div>
    </div>
  );
}
