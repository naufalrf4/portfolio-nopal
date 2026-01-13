import type { Metadata } from 'next';
import { NewKnowledgePageContent } from './NewKnowledgePageContent';

export const metadata: Metadata = {
  title: 'Add Knowledge Document',
  description: 'Create a new knowledge document for the RAG system',
};

export default function NewKnowledgePage() {
  return <NewKnowledgePageContent />;
}
