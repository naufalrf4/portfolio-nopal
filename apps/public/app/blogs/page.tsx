import type { Metadata } from 'next';
import { defaultClient } from '@naufalrf/sdk';
import type { BlogLink } from '@naufalrf/types';
import { BlogsContent } from '@/src/features/blogs/components';
import { Suspense } from 'react';
import { LoadingState, PageHeader } from '@/src/features/shared/components';
import { BookOpen } from 'lucide-react';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'Blogs - NaufalRF',
  description:
    'Technical blogs and practical insights by Naufal Rizqullah Firdaus covering software engineering, automation design, IoT integration, system architecture, and applied AI workflows.',
  keywords: [
    'Naufal Rizqullah Firdaus Blog',
    'Automation Engineering Blog',
    'IoT Integration Blog',
    'Software Architecture Notes',
  ],
  openGraph: {
    title: 'Blogs by NaufalRF',
    description:
      'Engineering notes and reflections from Naufal Rizqullah Firdaus on building automation systems, integrated solutions, and scalable software architectures.',
    type: 'website',
    url: 'https://naufalrf.tech/blogs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs by NaufalRF',
    description:
      'Engineering notes and reflections from Naufal Rizqullah Firdaus on building automation systems, integrated solutions, and scalable software architectures.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/blogs',
  },
};

async function getBlogs(): Promise<{ blogs: BlogLink[]; error?: string; ssrError?: boolean }> {
  try {
    const response = await defaultClient.blogs.getAll();
    const blogs = response.data || [];
    return { blogs };
  } catch (error) {
    console.error('Error fetching blogs during SSR:', error);
    return {
      blogs: [],
      ssrError: true,
    };
  }
}

export default async function BlogsPage() {
  const { blogs, error, ssrError } = await getBlogs();

  const serializedBlogs = Array.isArray(blogs)
    ? blogs.map((blog) => ({
        ...blog,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
      }))
    : [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Articles & Blog Posts"
          subtitle="Thoughts, tutorials, and insights on web development, software engineering, and technology published on various platforms."
          icon={BookOpen}
        />
        <Suspense fallback={<LoadingState type="skeleton" count={6} height="h-64" />}>
          <BlogsContent initialBlogs={serializedBlogs} error={error} ssrError={ssrError} />
        </Suspense>
      </div>
    </div>
  );
}
