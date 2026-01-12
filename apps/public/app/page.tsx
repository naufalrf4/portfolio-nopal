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
  title: 'NaufalRF | Full-Stack Engineer',
  description:
    'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications, backend systems, and modern DevOps practices.',
  openGraph: {
    title: 'NaufalRF | Full-Stack Engineer',
    description:
      'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
    type: 'website',
    url: 'https://naufalrf.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaufalRF | Full-Stack Engineer',
    description:
      'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
  },
  alternates: {
    canonical: 'https://naufalrf.tech',
  },
};

export default async function HomePage() {
  return (
    <main>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <HeroSection />
      <TechnicalExpertise />
      <FeaturedProjectsSection />
      <LatestArticlesSection />
      <Guestbook />
    </main>
  );
}
