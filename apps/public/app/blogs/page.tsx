import type { Metadata } from 'next';
import { defaultClient } from '@naufalrf/sdk';
import type { BlogLink } from '@naufalrf/types';
import { BlogsHeader, BlogsContent } from '@/src/features/blogs/components';
import { Suspense } from 'react';
import { LoadingState } from '@/src/features/shared/components';

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

async function getBlogs(): Promise<{ blogs: BlogLink[]; error?: string }> {
  try {
    const response = await defaultClient.blogs.getAll();
    const blogs = response.data || [];
    return { blogs };
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return {
      blogs: [],
      error: 'Failed to load articles. Please try again later.',
    };
  }
}

export default async function BlogsPage() {
  const { blogs, error } = await getBlogs();

  const serializedBlogs = Array.isArray(blogs)
    ? blogs.map((blog) => ({
        ...blog,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
      }))
    : [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <BlogsHeader />
        <Suspense fallback={<LoadingState type="skeleton" count={6} height="h-64" />}>
          <BlogsContent initialBlogs={serializedBlogs} error={error} />
        </Suspense>
      </div>
    </div>
  );
}
