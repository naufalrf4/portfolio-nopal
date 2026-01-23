import type { Metadata } from 'next';
import { KnowledgePageContent } from './KnowledgePageContent';

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description: 'Manage knowledge documents for RAG-powered AI assistant',
};

export default function KnowledgePage() {
  return <KnowledgePageContent />;
}
