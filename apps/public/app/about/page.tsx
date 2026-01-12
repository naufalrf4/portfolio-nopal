import type { Metadata } from 'next';
import Script from 'next/script';
import { AboutPageClient } from '@/src/features/about/components/AboutPageClient';
import { LoadingState } from '@/src/features/shared/components';
import type { AboutData } from '@/src/features/about/components';
import { personStructuredData } from '@/src/lib/structured-data';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about my journey, skills, and professional experience as a Full-Stack Engineer',
  openGraph: {
    title: 'About | NaufalRF',
    description:
      'Learn more about my journey, skills, and professional experience as a Full-Stack Engineer',
    type: 'website',
    url: 'https://naufalrf.tech/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | NaufalRF',
    description:
      'Learn more about my journey, skills, and professional experience as a Full-Stack Engineer',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/about',
  },
};

async function getAboutData(): Promise<{ data: AboutData | null; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/v1/public/about`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `Failed to fetch about data (${response.status})`,
      };
    }

    const result = await response.json();
    return {
      data: result?.data || null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to load about data',
    };
  }
}

export default async function AboutPage() {
  const { data, error } = await getAboutData();

  return (
    <main>
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <Suspense fallback={<LoadingState type="skeleton" count={3} />}>
        <AboutPageClient initialData={data} error={error} />
      </Suspense>
    </main>
  );
}
