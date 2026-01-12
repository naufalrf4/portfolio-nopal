import type { Metadata } from 'next';
import { GuestbookPageContent } from './GuestbookPageContent';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Manage guestbook entries from visitors',
};

export default function GuestbookPage() {
  return <GuestbookPageContent />;
}
