import type { Metadata } from 'next';
import Script from 'next/script';
import { defaultClient } from '@naufalrf/sdk';
import type { ProfileLink, BlogLink, Project } from '@naufalrf/sdk';
import {
  Hero,
  FeaturedProjects,
  LatestArticles,
  TechnicalExpertise,
} from '@/src/features/home/components';
import { Guestbook } from '@/src/components/home/Guestbook';
import { websiteStructuredData, personStructuredData } from '@/src/lib/structured-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'NaufalRF | Full-Stack Engineer',
  description:
    'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications, backend systems, and modern DevOps practices.',
  openGraph: {
    title: 'NaufalRF | Full-Stack Engineer',
    description:
      'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
    type: 'website',
    url: 'https://naufalrf.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaufalRF | Full-Stack Engineer',
    description:
      'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
  },
  alternates: {
    canonical: 'https://naufalrf.tech',
  },
};

interface AboutData {
  fullName: string;
  roles: string[];
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: { platform: string; url: string }[];
}

const MOCK_ABOUT: AboutData = {
  fullName: 'Naufal Rizqullah Firdaus',
  roles: ['Full-Stack Engineer', 'Backend Developer', 'DevOps Enthusiast'],
  bio: 'Passionate about building scalable web applications and creating seamless user experiences. I specialize in modern JavaScript frameworks, cloud infrastructure, and DevOps practices.',
  avatarUrl: '/avatar.jpg',
  resumeUrl: '/resume.pdf',
  socialLinks: [
    { platform: 'github', url: 'https://github.com/naufalrf' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/naufalrf' },
    { platform: 'twitter', url: 'https://twitter.com/naufalrf' },
  ],
};

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    summary:
      'Full-stack marketplace with real-time inventory management, payment processing, and analytics dashboard.',
    description: 'A comprehensive e-commerce solution built with modern web technologies.',
    techStack: ['Next.js', 'PostgreSQL', 'Redis', 'Stripe', 'TypeScript'],
    imageUrl: '/projects/ecommerce.jpg',
    category: 'web',
    featured: true,
    visible: true,
    order: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    slug: 'task-management-app',
    title: 'Task Management App',
    summary:
      'Collaborative project management tool with real-time updates, team workspaces, and Kanban boards.',
    description: 'Project management tool with real-time collaboration features.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'TailwindCSS'],
    imageUrl: '/projects/taskmanager.jpg',
    category: 'web',
    featured: true,
    visible: true,
    order: 2,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    slug: 'ai-content-generator',
    title: 'AI Content Generator',
    summary:
      'AI-powered content creation platform with multiple models, templates, and export options.',
    description: 'Content creation platform powered by AI.',
    techStack: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL', 'Vercel AI SDK'],
    imageUrl: '/projects/aicontent.jpg',
    category: 'web',
    featured: true,
    visible: true,
    order: 3,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

const MOCK_BLOGS: BlogLink[] = [
  {
    id: '1',
    title: 'Building Scalable APIs with Node.js',
    url: 'https://medium.com/@naufalrf/building-scalable-apis',
    source: 'medium',
    publishedAt: new Date('2024-01-20'),
    visible: true,
    order: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Modern DevOps Practices for Startups',
    url: 'https://dev.to/naufalrf/devops-practices',
    source: 'devto',
    publishedAt: new Date('2024-02-15'),
    visible: true,
    order: 2,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '3',
    title: 'TypeScript Best Practices in 2024',
    url: 'https://medium.com/@naufalrf/typescript-best-practices',
    source: 'medium',
    publishedAt: new Date('2024-03-10'),
    visible: true,
    order: 3,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
];

async function getAboutData(): Promise<AboutData> {
  try {
    const response = await defaultClient.profileLinks.getAll();
    const profileLinks: ProfileLink[] = response.data || [];

    return {
      ...MOCK_ABOUT,
      socialLinks:
        profileLinks.length > 0
          ? profileLinks.map((link: ProfileLink) => ({
              platform: link.icon || 'link',
              url: link.url,
            }))
          : MOCK_ABOUT.socialLinks,
    };
  } catch {
    return MOCK_ABOUT;
  }
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await defaultClient.projects.getAll({ featured: true, limit: 3 });
    const projects: Project[] = response.data?.projects || [];
    return projects.length > 0 ? projects : MOCK_PROJECTS;
  } catch {
    return MOCK_PROJECTS;
  }
}

async function getLatestBlogs(): Promise<BlogLink[]> {
  try {
    const response = await defaultClient.blogs.getAll();
    const blogs: BlogLink[] = response.data || [];
    return blogs.length > 0 ? blogs.slice(0, 3) : MOCK_BLOGS;
  } catch {
    return MOCK_BLOGS;
  }
}

export default async function HomePage() {
  const [about, featuredProjects, latestBlogs] = await Promise.all([
    getAboutData(),
    getFeaturedProjects(),
    getLatestBlogs(),
  ]);

  return (
    <main>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <Hero about={about} />
      <TechnicalExpertise />
      <FeaturedProjects projects={featuredProjects} />
      <LatestArticles blogs={latestBlogs} />
      <Guestbook />
    </main>
  );
}
