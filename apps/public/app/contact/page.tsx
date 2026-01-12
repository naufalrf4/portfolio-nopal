import type { Metadata } from 'next';
import { ContactContent } from '@/src/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with NaufalRF. Send a message or book a call to discuss your project, collaboration, or job opportunity.',
  openGraph: {
    title: 'Contact | NaufalRF',
    description:
      'Get in touch with NaufalRF. Send a message or book a call to discuss your project, collaboration, or job opportunity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | NaufalRF',
    description:
      'Get in touch with NaufalRF. Send a message or book a call to discuss your project, collaboration, or job opportunity.',
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
