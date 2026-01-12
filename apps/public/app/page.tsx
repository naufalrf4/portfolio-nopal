import type { Metadata } from 'next';
import Script from 'next/script';
import { defaultClient } from '@naufalrf/sdk';
import type { ProfileLink, BlogLink, Project } from '@naufalrf/sdk';
import {
  Hero,
  FeaturedProjects,
  LatestArticles,
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

async function getAboutData() {
  try {
    const response = await defaultClient.profileLinks.getAll();
    const profileLinks: ProfileLink[] = response.data || [];

    return {
      fullName: 'Naufal Rizqullah Firdaus',
      roles: ['Full-Stack Engineer', 'Backend Developer', 'DevOps Enthusiast'],
      bio: 'Passionate about building scalable web applications and creating seamless user experiences.',
      avatarUrl: '',
      resumeUrl: '',
      socialLinks:
        profileLinks.length > 0
          ? profileLinks.map((link: ProfileLink) => ({
              platform: link.icon || 'link',
              url: link.url,
            }))
          : [],
    };
  } catch {
    return {
      fullName: 'Naufal Rizqullah Firdaus',
      roles: ['Full-Stack Engineer'],
      bio: 'Full-Stack Engineer',
      avatarUrl: '',
      resumeUrl: '',
      socialLinks: [],
    };
  }
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await defaultClient.projects.getAll({ featured: true, limit: 3 });
    const projects: Project[] = response.data?.projects || [];
    return projects.length > 0 ? projects : [];
  } catch {
    return [];
  }
}

async function getLatestBlogs(): Promise<BlogLink[]> {
  try {
    const response = await defaultClient.blogs.getAll();
    const blogs: BlogLink[] = response.data || [];
    return blogs.length > 0 ? blogs.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [about, featuredProjects, latestBlogs] = await Promise.all([
    getAboutData(),
    getFeaturedProjects(),
    getLatestBlogs(),
  ]);

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
      <Hero about={about} />
      <TechnicalExpertise />
      <FeaturedProjects projects={featuredProjects} />
      <LatestArticles blogs={latestBlogs} />
      <Guestbook />
    </main>
  );
}
