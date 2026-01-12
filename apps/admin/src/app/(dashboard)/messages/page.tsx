import type { Metadata } from 'next';
import { MessagesPageContent } from './components/MessagesPageContent';

export const metadata: Metadata = {
  title: 'Anonymous Messages',
  description: 'Manage anonymous messages from your visitors',
};

export default function MessagesPage() {
  return <MessagesPageContent />;
}
