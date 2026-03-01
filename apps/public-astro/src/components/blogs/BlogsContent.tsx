import React, { useState, useMemo } from 'react';
import { BlogsGrid } from './BlogsGrid';
import { NeuCard } from '../shared';
import type { BlogLink } from '@/types';

interface BlogsContentProps {
  initialBlogs: BlogLink[];
}

export function BlogsContent({ initialBlogs }: BlogsContentProps) {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const blogs = initialBlogs || [];

  const sources = useMemo(() => {
    const uniqueSources = new Set(blogs.map((blog) => blog.source));
    return ['all', ...Array.from(uniqueSources).sort()];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    if (selectedSource === 'all') {
      return blogs;
    }
    return blogs.filter((blog) => blog.source === selectedSource);
  }, [blogs, selectedSource]);

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
