import type { Metadata } from 'next';
import { ContactContent } from '@/src/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact - NaufalRF',
  description:
    'Contact Naufal Rizqullah Firdaus for software engineering roles, automation and IoT projects, solution engineering work, freelance opportunities, or technical collaboration.',
  keywords: [
    'Contact Naufal Rizqullah Firdaus',
    'Hire Automation Engineer Indonesia',
    'Solution Engineer Indonesia',
  ],
  openGraph: {
    title: 'Contact NaufalRF',
    description:
      'Get in touch with Naufal Rizqullah Firdaus who is open to full time roles, freelance automation projects, IoT integration work, and solution oriented engineering collaboration.',
    type: 'website',
    url: 'https://naufalrf.tech/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact NaufalRF',
    description:
      'Get in touch with Naufal Rizqullah Firdaus who is open to full time roles, freelance automation projects, IoT integration work, and solution oriented engineering collaboration.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/contact',
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
