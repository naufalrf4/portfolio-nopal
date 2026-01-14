'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogsGrid } from './BlogsGrid';
import { LoadingState, ErrorState } from '@/src/features/shared/components';
import { NeuCard } from '@/src/features/shared/components';
import type { BlogLink } from './types';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

interface BlogsContentProps {
  initialBlogs: BlogLink[];
  error?: string;
  ssrError?: boolean;
}

export function BlogsContent({
  initialBlogs,
  error: initialError,
  ssrError = false,
}: BlogsContentProps) {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(ssrError && initialBlogs.length === 0);
  const [error, setError] = useState<string | undefined>(initialError);
  const [blogs, setBlogs] = useState<BlogLink[]>(initialBlogs);

  // Get unique sources from blogs
  const sources = useMemo(() => {
    const uniqueSources = new Set(blogs.map((blog) => blog.source));
    return ['all', ...Array.from(uniqueSources).sort()];
  }, [blogs]);

  // Filter blogs by selected source
  const filteredBlogs = useMemo(() => {
    if (selectedSource === 'all') {
      return blogs;
    }
    return blogs.filter((blog) => blog.source === selectedSource);
  }, [blogs, selectedSource]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetch(`${API_BASE}/api/v1/public/blogs`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const result = await response.json();
      // API response format: { success: true, data: { blogs: [...], meta: {...} } }
      const blogsData = result.data?.blogs || result.blogs || [];
      setBlogs(blogsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch if SSR failed and no initial blogs
  useEffect(() => {
    if (ssrError && initialBlogs.length === 0) {
      fetchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <ErrorState
        title="Failed to load articles"
        message={error}
        onRetry={fetchBlogs}
        showRetry={true}
      />
    );
  }

  if (isLoading) {
    return <LoadingState type="skeleton" count={6} height="h-64" />;
  }

  return (
    <div>
      {/* Filter by source */}
      {sources.length > 2 && (
        <div className="mb-8">
          <NeuCard className="p-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-[#3D4852] mr-2 flex items-center">
                Filter by platform:
              </span>
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() => setSelectedSource(source)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSource === source
                      ? 'bg-[#3B82F6] text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]'
                      : 'bg-[#E0E5EC] text-[#6B7280] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:shadow-[2px_2px_4px_rgba(163,177,198,0.6),-2px_-2px_4px_rgba(255,255,255,0.5)]'
                  }`}
                >
                  {source === 'all' ? 'All' : source}
                </button>
              ))}
            </div>
          </NeuCard>
        </div>
      )}

      <BlogsGrid blogs={filteredBlogs} />
    </div>
  );
}
