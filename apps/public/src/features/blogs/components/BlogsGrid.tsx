import { BlogCard } from './BlogCard';
import { NeuCard } from '@/src/features/shared/components';
import type { BlogLink } from './types';

interface BlogsGridProps {
  blogs: BlogLink[];
}

export function BlogsGrid({ blogs }: BlogsGridProps) {
  if (blogs.length === 0) {
    return (
      <NeuCard className="text-center py-12">
        <p className="text-[#6B7280]">No articles available yet.</p>
      </NeuCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
