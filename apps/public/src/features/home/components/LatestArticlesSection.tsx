import { LatestArticles } from './LatestArticles';
import { blogsApi } from '@/src/lib/api/endpoints/blogs';
import type { BlogLink as ApiBlogLink } from '@/src/lib/api/types';
import type { BlogLink } from './types';

export async function LatestArticlesSection() {
  try {
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

    return <LatestArticles blogs={mappedBlogs} />;
  } catch (error) {
    console.error('Error fetching blogs during SSR:', error);
    return <LatestArticles blogs={[]} />;
  }
}
