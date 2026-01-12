import type { Metadata } from 'next';
import { ContactsPageContent } from './ContactsPageContent';

export const metadata: Metadata = {
  title: 'Contact Management',
  description: 'Manage contact form submissions and settings',
};

export default function ContactsPage() {
  return <ContactsPageContent />;
}
