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
    url: 'https://naufalrf.tech/blogs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | NaufalRF',
    description:
      'Thoughts, tutorials, and insights on web development, software engineering, and technology.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/blogs',
  },
};

async function getBlogs(): Promise<BlogLink[]> {
  try {
    const response = await defaultClient.blogs.getAll();
    const blogs = response.data || [];
    return blogs.length > 0 ? blogs : [];
  } catch {
    return [];
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
