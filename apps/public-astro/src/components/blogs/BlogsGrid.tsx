import React from 'react';
import { BlogCard } from './BlogCard';
import { NeuCard } from '../shared';
import type { BlogLink } from '@/types';
import { FileX } from 'lucide-react';

interface BlogsGridProps {
  blogs: BlogLink[];
}

function EmptyState() {
  return (
    <div className="w-full flex justify-center py-12">
      <NeuCard className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-[#E0E5EC] rounded-full flex items-center justify-center mb-4 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          <FileX className="w-8 h-8 text-[#6B7280]" />
        </div>
        <h3 className="text-xl font-bold text-[#3D4852] mb-2">No articles found</h3>
        <p className="text-[#6B7280]">
          No articles are available at the moment. Check back later for new content!
        </p>
      </NeuCard>
    </div>
  );
}

export function BlogsGrid({ blogs }: BlogsGridProps) {
  if (!blogs || blogs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
      {blogs.map((blog, index) => (
        <div key={blog.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
}
