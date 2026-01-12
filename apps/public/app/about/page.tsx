import type { Metadata } from 'next';
import { AboutContent } from '@/src/features/about/components';
import type { AboutData } from '@/src/features/about/components';

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

const mockAboutData: AboutData = {
  fullName: 'Naufal RF',
  tagline: 'Full-Stack Engineer & Tech Enthusiast',
  roles: ['Full-Stack Developer', 'Tech Lead', 'Open Source Contributor', 'System Architect'],
  bio: 'Passionate software engineer with experience building scalable web applications. I specialize in React, Node.js, and cloud technologies, with a focus on creating exceptional user experiences and robust backend systems.',
  email: 'hello@naufalrf.tech',
  location: 'Jakarta, Indonesia',
  avatarUrl: null,
  resumeUrl: null,
  socialLinks: {
    github: 'https://github.com/naufalrf',
    linkedin: 'https://linkedin.com/in/naufalrf',
    twitter: 'https://twitter.com/naufalrf',
    instagram: 'https://instagram.com/naufalrf',
  },
  skills: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Prisma',
    'Tailwind CSS',
    'Docker',
    'AWS',
    'Redis',
    'GraphQL',
    'Microservices',
  ],
  experience: [
    {
      type: 'Work',
      title: 'Senior Full-Stack Engineer',
      organization: 'Tech Startup Inc.',
      location: 'Jakarta, Indonesia',
      startDate: '2022-01',
      endDate: null,
      description:
        'Leading development of modern web applications using Next.js and TypeScript. Architected microservices infrastructure handling 1M+ daily requests.',
    },
    {
      type: 'Work',
      title: 'Full-Stack Developer',
      organization: 'Digital Agency Co.',
      location: 'Jakarta, Indonesia',
      startDate: '2020-03',
      endDate: '2021-12',
      description:
        'Developed client projects using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and improved deployment processes.',
    },
    {
      type: 'Education',
      title: 'Bachelor of Computer Science',
      organization: 'University of Indonesia',
      location: 'Jakarta, Indonesia',
      startDate: '2018-08',
      endDate: '2022-06',
      description:
        'Graduated with honors (GPA 3.8/4.0). Focus on software engineering, algorithms, and distributed systems.',
    },
  ],
};

async function getAboutData(): Promise<AboutData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/v1/public/about`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return mockAboutData;
    }

    const data = await response.json();
    return data?.data || mockAboutData;
  } catch {
    return mockAboutData;
  }
}

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <main>
      <AboutContent about={about} />
    </main>
  );
}
