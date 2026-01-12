import { BlogCard } from './BlogCard';
import { EmptyState } from '@/src/features/shared/components';
import type { BlogLink } from './types';

interface BlogsGridProps {
  blogs: BlogLink[];
}

export function BlogsGrid({ blogs }: BlogsGridProps) {
  if (blogs.length === 0) {
    return (
      <EmptyState
        title="No articles found"
        message="No articles are available at the moment. Check back later for new content!"
      />
    );
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
