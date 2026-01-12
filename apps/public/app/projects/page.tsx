import type { Metadata } from 'next';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectsGrid } from '@/src/features/projects/components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web applications, mobile apps, backend systems, and DevOps projects showcasing modern development practices.',
  openGraph: {
    title: 'Projects | NaufalRF',
    description:
      'Explore my portfolio of web applications, mobile apps, backend systems, and DevOps projects.',
    type: 'website',
    url: 'https://naufalrf.tech/projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | NaufalRF',
    description:
      'Explore my portfolio of web applications, mobile apps, backend systems, and DevOps projects.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/projects',
  },
};

async function getProjects() {
  try {
    const response = await defaultClient.projects.getAll();
    const projects = response.data?.projects || [];
    return projects.length > 0 ? projects : [];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const serializedProjects = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
  }));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Projects
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A collection of projects showcasing my expertise in web development, mobile
            applications, backend systems, and DevOps practices. Each project represents real-world
            problem-solving and technical innovation.
          </p>
        </header>

        <ProjectsGrid projects={serializedProjects} />
      </div>
    </div>
  );
}
