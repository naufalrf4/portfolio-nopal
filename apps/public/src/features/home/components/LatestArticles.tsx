import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  Section,
  SectionHeader,
  NeuCard,
  NeuBadge,
  NeuButton,
} from '@/src/features/shared/components';
import { ArrowRight, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import type { BlogLink } from './types';

interface LatestArticlesProps {
  blogs: BlogLink[];
}

export function LatestArticles({ blogs }: LatestArticlesProps) {
  const latestBlogs = blogs.slice(0, 4);

  if (latestBlogs.length === 0) {
    return null;
  }

  return (
    <Section className="bg-[#E0E5EC]">
      <SectionHeader
        title="Latest Articles"
        subtitle="Thoughts, tutorials, and insights on software development and technology"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {latestBlogs.map((blog) => (
          <a key={blog.id} href={blog.url} target="_blank" rel="noopener noreferrer">
            <NeuCard hover className="h-full group">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
                {blog.imageUrl ? (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">{blog.title.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <NeuBadge variant="accent" size="sm">
                  {blog.source}
                </NeuBadge>
                <div className="flex items-center text-sm text-[#6B7280]">
                  <Calendar className="w-4 h-4 mr-1" />
                  {blog.publishedAt ? formatDate(blog.publishedAt) : 'No date'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#3D4852] group-hover:text-[#3B82F6] transition-colors mb-2 line-clamp-2">
                {blog.title}
              </h3>

              {blog.description && (
                <p className="text-[#6B7280] line-clamp-2">{blog.description}</p>
              )}

              <div className="mt-4 flex items-center text-[#3B82F6] font-medium">
                Read Article
                <ExternalLink className="ml-2 w-4 h-4" />
              </div>
            </NeuCard>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/blogs">
          <NeuButton variant="default" size="lg">
            View All Articles
            <ArrowRight className="ml-2 w-5 h-5" />
          </NeuButton>
        </Link>
      </div>
    </Section>
  );
}
