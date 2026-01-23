import type { Metadata } from 'next';
import { ChatLogsPageContent } from './ChatLogsPageContent';

export const metadata: Metadata = {
  title: 'Chat Logs',
  description: 'View and manage AI assistant chat conversation logs',
};

export default function ChatLogsPage() {
  return <ChatLogsPageContent />;
}
