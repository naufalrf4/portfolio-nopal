import type { Metadata } from 'next';
import { defaultClient } from '@naufalrf/sdk';
import type { BlogLink } from '@naufalrf/types';
import { BlogsHeader, BlogsGrid } from '@/src/features/blogs/components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Thoughts, tutorials, and insights on web development, software engineering, and technology.',
  openGraph: {
    title: 'Articles | NaufalRF',
    description:
      'Thoughts, tutorials, and insights on web development, software engineering, and technology.',
    type: 'website',
  },
};

const MOCK_BLOGS: BlogLink[] = [
  {
    id: '1',
    url: 'https://medium.com/@naufalrf/building-scalable-nextjs-apps',
    title: 'Building Scalable Next.js Applications with App Router',
    description:
      'A comprehensive guide to structuring large-scale Next.js applications using the new App Router, server components, and best practices for maintainability.',
    imageUrl: '/placeholder.jpg',
    source: 'Medium',
    publishedAt: new Date('2024-03-15'),
    visible: true,
    order: 1,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    url: 'https://dev.to/naufalrf/typescript-patterns',
    title: 'Advanced TypeScript Patterns for React Developers',
    description:
      'Exploring advanced TypeScript patterns including discriminated unions, template literal types, and conditional types for building type-safe React applications.',
    imageUrl: '/placeholder.jpg',
    source: 'Dev.to',
    publishedAt: new Date('2024-02-28'),
    visible: true,
    order: 2,
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
  },
  {
    id: '3',
    url: 'https://hashnode.com/@naufalrf/prisma-optimization',
    title: 'Optimizing Prisma Queries for Production',
    description:
      'Learn how to optimize your Prisma queries for better performance, including connection pooling, query batching, and caching strategies.',
    imageUrl: '/placeholder.jpg',
    source: 'Hashnode',
    publishedAt: new Date('2024-02-10'),
    visible: true,
    order: 3,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    url: 'https://medium.com/@naufalrf/neumorphic-design',
    title: 'Implementing Neumorphic Design in Modern Web Apps',
    description:
      'A practical guide to creating stunning neumorphic interfaces using CSS, including accessibility considerations and performance tips.',
    imageUrl: '/placeholder.jpg',
    source: 'Medium',
    publishedAt: new Date('2024-01-20'),
    visible: true,
    order: 4,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    url: 'https://dev.to/naufalrf/docker-nodejs',
    title: 'Docker Best Practices for Node.js Applications',
    description:
      'Essential Docker configurations and optimizations for deploying Node.js applications in production environments.',
    imageUrl: '/placeholder.jpg',
    source: 'Dev.to',
    publishedAt: new Date('2024-01-05'),
    visible: true,
    order: 5,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    url: 'https://linkedin.com/pulse/naufalrf/ai-integration',
    title: 'Integrating AI into Your Web Applications',
    description:
      'How to leverage OpenAI, Vercel AI SDK, and other tools to build intelligent features into your web applications.',
    imageUrl: '/placeholder.jpg',
    source: 'LinkedIn',
    publishedAt: new Date('2023-12-15'),
    visible: true,
    order: 6,
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15'),
  },
];

async function getBlogs(): Promise<BlogLink[]> {
  try {
    const response = await defaultClient.blogs.getAll();
    const blogs = response.data || [];
    return blogs.length > 0 ? blogs : MOCK_BLOGS;
  } catch {
    return MOCK_BLOGS;
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  const serializedBlogs = blogs.map((blog) => ({
    ...blog,
    publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
    createdAt: new Date(blog.createdAt),
    updatedAt: new Date(blog.updatedAt),
  }));

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <BlogsHeader />
        <BlogsGrid blogs={serializedBlogs} />
      </div>
    </div>
  );
}
