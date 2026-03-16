import React from 'react';
import { NeuCard, NeuBadge } from '../shared';
import { Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BlogLink } from '@/types';

interface BlogCardProps {
  blog: BlogLink;
}

export function BlogCard({ blog }: BlogCardProps) {
  const title = blog.title?.trim() || 'Untitled Article';
  const source = blog.source?.trim() || 'Unknown';
  const url = blog.url?.trim() || '#';

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <NeuCard hover className="h-full group">
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
              <span className="text-4xl text-white font-bold">{title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {blog.category && (
            <NeuBadge variant="accent" size="sm">
              {blog.category}
            </NeuBadge>
          )}
          <NeuBadge variant="default" size="sm">
            {source}
          </NeuBadge>
          <div className="flex items-center text-sm text-[#6B7280]">
            <Calendar className="w-4 h-4 mr-1" />
            {blog.publishedAt ? formatDate(blog.publishedAt) : 'No date'}
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#3D4852] group-hover:text-[#3B82F6] transition-colors mb-2 line-clamp-2">
          {title}
        </h3>

        {blog.description && <p className="text-[#6B7280] line-clamp-2 mb-4">{blog.description}</p>}

        <div className="flex items-center text-[#3B82F6] font-medium mt-auto">
          Read Article
          <ExternalLink className="ml-2 w-4 h-4" />
        </div>
      </NeuCard>
    </a>
  );
}
