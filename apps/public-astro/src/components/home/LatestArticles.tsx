import { Section } from '@/components/shared/Section';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { NeuCard } from '@/components/shared/NeuCard';
import { NeuBadge } from '@/components/shared/NeuBadge';
import { NeuButton } from '@/components/shared/NeuButton';
import { ArrowRight, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BlogLink } from '@/types';
import { motion } from 'framer-motion';

interface LatestArticlesProps {
  blogs?: BlogLink[];
}

export function LatestArticles({ blogs }: LatestArticlesProps) {
  const latestBlogs = (blogs ?? []).slice(0, 6);

  if (latestBlogs.length === 0) {
    return null;
  }

  return (
    <Section className="homepage-reveal-soft">
      <SectionHeader
        title="Latest Articles"
        subtitle="Thoughts, tutorials, and insights on software development and technology"
      />

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
        {latestBlogs.map((blog, index) => (
          <motion.a
            key={blog.id}
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[280px] w-[280px] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:flex-shrink"
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.72, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <NeuCard hover className="h-full group p-4 homepage-card-hover">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
                {blog.imageUrl ? (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">{blog.title.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <NeuBadge variant="accent" size="sm">
                  {blog.source}
                </NeuBadge>
                <div className="flex items-center text-xs text-[#6B7280]">
                  <Calendar className="w-3 h-3 mr-1" />
                  {blog.publishedAt ? formatDate(blog.publishedAt) : 'No date'}
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#3D4852] group-hover:text-[#3B82F6] transition-all duration-300 mb-2 line-clamp-2 group-hover:translate-x-0.5">
                {blog.title}
              </h3>

              {blog.description && (
                <p className="text-sm text-[#6B7280] line-clamp-2">{blog.description}</p>
              )}

              <div className="mt-3 flex items-center text-sm text-[#3B82F6] font-medium transition-transform duration-300 group-hover:translate-x-0.5">
                Read Article
                <ExternalLink className="ml-1.5 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </NeuCard>
          </motion.a>
        ))}
      </div>

      <motion.div
        className="mt-10 text-center homepage-reveal-soft"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="/blogs">
          <NeuButton variant="primary" size="md" className="min-w-[200px] group">
            View All Articles
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </NeuButton>
        </a>
      </motion.div>
    </Section>
  );
}
