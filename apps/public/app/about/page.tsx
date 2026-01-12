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
  },
};

const mockAboutData: AboutData = {
  fullName: 'Naufal Rizky F',
  tagline: 'Full-Stack Engineer',
  roles: ['Full-Stack Engineer', 'Backend Developer', 'DevOps Enthusiast'],
  bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies, with a focus on creating exceptional user experiences and robust backend systems.',
  email: 'hello@naufalrf.tech',
  location: 'Jakarta, Indonesia',
  avatarUrl: undefined,
  resumeUrl: '/resume.pdf',
  socialLinks: [
    { platform: 'github', url: 'https://github.com/naufalrf' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/naufalrf' },
    { platform: 'twitter', url: 'https://twitter.com/naufalrf' },
  ],
  skills: [
    { name: 'React / Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'TailwindCSS', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Backend' },
    { name: 'MongoDB', category: 'Backend' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS', category: 'DevOps' },
    { name: 'CI/CD', category: 'DevOps' },
  ],
  experience: [
    {
      id: '1',
      type: 'work',
      title: 'Senior Full-Stack Engineer',
      organization: 'Tech Company',
      startDate: '2022',
      description:
        'Leading development of microservices architecture and mentoring junior developers. Built scalable APIs serving 1M+ daily requests.',
    },
    {
      id: '2',
      type: 'work',
      title: 'Full-Stack Developer',
      organization: 'Startup Inc',
      startDate: '2020',
      endDate: '2022',
      description:
        'Developed and maintained e-commerce platform using React and Node.js. Improved site performance by 40%.',
    },
    {
      id: '3',
      type: 'work',
      title: 'Frontend Developer',
      organization: 'Digital Agency',
      startDate: '2019',
      endDate: '2020',
      description:
        'Created responsive web applications for various clients using React and Vue.js. Collaborated with designers to implement pixel-perfect UIs.',
    },
    {
      id: '4',
      type: 'education',
      title: 'Bachelor of Computer Science',
      organization: 'University of Technology',
      startDate: '2015',
      endDate: '2019',
      description:
        'Graduated with honors. Focused on software engineering and distributed systems. Published research on web performance optimization.',
    },
    {
      id: '5',
      type: 'education',
      title: 'Full-Stack Web Development Bootcamp',
      organization: 'Coding Academy',
      startDate: '2018',
      endDate: '2018',
      description:
        'Intensive 12-week program covering modern web development technologies including React, Node.js, and database design.',
    },
    {
      id: '6',
      type: 'certification',
      title: 'AWS Solutions Architect Associate',
      organization: 'Amazon Web Services',
      startDate: '2023',
      description:
        'Demonstrated expertise in designing distributed systems on AWS, including high availability and cost optimization.',
    },
    {
      id: '7',
      type: 'certification',
      title: 'Professional Scrum Master I',
      organization: 'Scrum.org',
      startDate: '2022',
      description:
        'Certified in Scrum framework and agile methodologies for leading development teams.',
    },
    {
      id: '8',
      type: 'certification',
      title: 'Google Cloud Professional Developer',
      organization: 'Google Cloud',
      startDate: '2021',
      description:
        'Validated skills in developing scalable applications using Google Cloud Platform services.',
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
