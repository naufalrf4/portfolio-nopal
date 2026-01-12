import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { CTA } from '@/components/home/CTA';

const MOCK_FEATURED_PROJECTS = [
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    summary:
      'Full-stack marketplace with real-time inventory management, payment processing, and analytics dashboard.',
    techStack: ['Next.js', 'PostgreSQL', 'Redis', 'Stripe', 'TypeScript'],
    imageUrl: '/projects/ecommerce.jpg',
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    summary:
      'Collaborative project management tool with real-time updates, team workspaces, and Kanban boards.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'TailwindCSS'],
    imageUrl: '/projects/taskmanager.jpg',
  },
  {
    slug: 'ai-content-generator',
    title: 'AI Content Generator',
    summary:
      'AI-powered content creation platform with multiple models, templates, and export options.',
    techStack: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL', 'Vercel AI SDK'],
    imageUrl: '/projects/aicontent.jpg',
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    summary:
      'Real-time analytics platform with customizable widgets, data visualization, and reporting.',
    techStack: ['React', 'FastAPI', 'Python', 'PostgreSQL', 'Chart.js'],
    imageUrl: '/projects/analytics.jpg',
  },
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProjects projects={MOCK_FEATURED_PROJECTS} />
      <CTA />
    </main>
  );
}
