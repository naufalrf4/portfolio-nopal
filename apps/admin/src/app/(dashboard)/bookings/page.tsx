import type { Metadata } from 'next';
import { BookingsPageContent } from './BookingsPageContent';

export const metadata: Metadata = {
  title: 'Booking Management',
  description: 'Manage appointments and availability slots',
};

export default function BookingsPage() {
  return <BookingsPageContent />;
}
