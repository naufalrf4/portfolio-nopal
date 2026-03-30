import type { Metadata } from 'next';
import { BlogsPageContent } from './BlogsPageContent';

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Manage your blog articles, publication links, and writing destinations.',
};

export default function BlogLinksPage() {
  return <BlogsPageContent />;
}
