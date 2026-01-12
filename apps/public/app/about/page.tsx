import type { Metadata } from 'next';
import Script from 'next/script';
import { AboutContent } from '@/src/features/about/components';
import type { AboutData } from '@/src/features/about/components';
import { personStructuredData } from '@/src/lib/structured-data';

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

async function getAboutData(): Promise<AboutData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/v1/public/about`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        fullName: 'Naufal RF',
        tagline: 'Full-Stack Engineer & Tech Enthusiast',
        roles: ['Full-Stack Developer'],
        bio: 'Passionate software engineer with experience building scalable web applications.',
        email: 'hello@naufalrf.tech',
        location: 'Jakarta, Indonesia',
        avatarUrl: null,
        resumeUrl: null,
        socialLinks: {},
        skills: [],
        experience: [],
      };
    }

    const data = await response.json();
    return (
      data?.data || {
        fullName: 'Naufal RF',
        tagline: 'Full-Stack Engineer & Tech Enthusiast',
        roles: ['Full-Stack Developer'],
        bio: 'Passionate software engineer with experience building scalable web applications.',
        email: 'hello@naufalrf.tech',
        location: 'Jakarta, Indonesia',
        avatarUrl: null,
        resumeUrl: null,
        socialLinks: {},
        skills: [],
        experience: [],
      }
    );
  } catch {
    return {
      fullName: 'Naufal RF',
      tagline: 'Full-Stack Engineer & Tech Enthusiast',
      roles: ['Full-Stack Developer'],
      bio: 'Passionate software engineer with experience building scalable web applications.',
      email: 'hello@naufalrf.tech',
      location: 'Jakarta, Indonesia',
      avatarUrl: null,
      resumeUrl: null,
      socialLinks: {},
      skills: [],
      experience: [],
    };
  }
}

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <main>
      <Script
        id="person-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <AboutContent about={about} />
    </main>
  );
}
