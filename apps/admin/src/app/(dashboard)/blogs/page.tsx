import type { Metadata } from 'next';
import { BlogsPageContent } from './BlogsPageContent';

export const metadata: Metadata = {
  title: 'Blog Links',
  description: 'Manage your external blog articles and publications',
};

export default function BlogLinksPage() {
  return <BlogsPageContent />;
}
