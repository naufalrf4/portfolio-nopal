import type { Metadata } from 'next';
import { AboutPageClient } from '@/src/features/about/components/AboutPageClient';
import { api } from '@/src/lib/api';

export const revalidate = 7200;

export const metadata: Metadata = {
  title: 'About - NaufalRF',
  description:
    'Naufal Rizqullah Firdaus is a Computer Engineering student and software engineer with a strong focus on full stack development, workflow automation, IoT system integration, and solution oriented engineering for real world use cases.',
  keywords: [
    'About Naufal Rizqullah Firdaus',
    'Software Engineer Indonesia',
    'Automation Engineer Profile',
    'Solution Engineer Indonesia',
  ],
  openGraph: {
    title: 'About NaufalRF',
    description:
      'Learn more about Naufal Rizqullah Firdaus, a solution focused software engineer who combines clean UX, system architecture thinking, automation, and IoT integration to build practical digital products.',
    url: 'https://naufalrf.tech/about',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About NaufalRF',
    description:
      'Learn more about Naufal Rizqullah Firdaus, a solution focused software engineer who combines clean UX, system architecture thinking, automation, and IoT integration to build practical digital products.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/about',
  },
};

export default async function AboutPage() {
  try {
    const [about, achievementsData] = await Promise.all([
      api.about.get(),
      api.achievements.getAll().catch(() => ({ achievements: [], meta: { total: 0 } })),
    ]);
    return <AboutPageClient initialData={about} achievements={achievementsData.achievements} />;
  } catch (error) {
    console.error('Error fetching about data during SSR:', error);
    return <AboutPageClient initialData={null} achievements={[]} ssrError={true} />;
  }
}
