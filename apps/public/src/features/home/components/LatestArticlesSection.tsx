'use client';

import { useEffect, useState } from 'react';
import { LatestArticles } from './LatestArticles';
import { LoadingState, ErrorState, Section } from '@/src/features/shared/components';
import { blogsApi } from '@/src/lib/api/endpoints/blogs';
import type { BlogLink as ApiBlogLink } from '@/src/lib/api/types';
import type { BlogLink } from './types';

export function LatestArticlesSection() {
  const [blogs, setBlogs] = useState<BlogLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogsApi.getAll(3);
      const mappedBlogs: BlogLink[] = (response.blogs || []).map((b: ApiBlogLink) => ({
        id: b.id,
        title: b.title,
        url: b.url,
        description: b.description || undefined,
        imageUrl: b.imageUrl || undefined,
        source: b.source,
        publishedAt: b.publishedAt,
      }));
      setBlogs(mappedBlogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load latest articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Section className="bg-[#E0E5EC]">
        <div className="py-12">
          <LoadingState type="skeleton" count={3} height="h-64" />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="bg-[#E0E5EC]">
        <ErrorState title="Failed to load articles" message={error} onRetry={fetchData} />
      </Section>
    );
  }

  return <LatestArticles blogs={blogs} />;
}
