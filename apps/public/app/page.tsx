import type { Metadata } from 'next';
import Script from 'next/script';
import {
  HeroSection,
  FeaturedProjectsSection,
  LatestArticlesSection,
  TechnicalExpertise,
} from '@/src/features/home/components';
import { Guestbook } from '@/src/components/home/Guestbook';
import { websiteStructuredData, personStructuredData } from '@/src/lib/structured-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'NaufalRF Portfolio',
  description:
    'Hi, I am Naufal Rizqullah Firdaus, a final year Computer Engineering student and software engineer who builds user friendly web applications, automation systems, AI powered workflows, and IoT integrated solutions. Based in Indonesia and open to remote and global roles.',
  keywords: [
    'NaufalRF',
    'Naufal Rizqullah Firdaus',
    'Software Engineer Indonesia',
    'Automation Engineer',
    'IoT Integration Portfolio',
  ],
  authors: [{ name: 'Naufal Rizqullah Firdaus' }],
  openGraph: {
    title: 'NaufalRF',
    description:
      'The personal portfolio of Naufal Rizqullah Firdaus featuring full stack development, automation engineering, IoT integration, and real world digital solutions designed for scalability and usability.',
    type: 'website',
    url: 'https://naufalrf.tech',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NaufalRF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaufalRF',
    description:
      'The personal portfolio of Naufal Rizqullah Firdaus featuring full stack development, automation engineering, IoT integration, and real world digital solutions designed for scalability and usability.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://naufalrf.tech',
  },
};

export default async function HomePage() {
  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
      />

      <HeroSection />
      <TechnicalExpertise />
      <FeaturedProjectsSection />
      <LatestArticlesSection />
      <Guestbook />
    </>
  );
}
