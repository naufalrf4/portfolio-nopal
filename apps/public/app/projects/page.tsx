import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsContent } from '@/src/features/projects/components/ProjectsContent';
import { LoadingState, PageHeader } from '@/src/features/shared/components';
import { FolderKanban } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects - NaufalRF',
  description:
    'Explore real world projects by Naufal Rizqullah Firdaus including full stack web applications, automation tools, AI driven workflows, IoT monitoring systems, and end to end solution engineering implementations.',
  keywords: [
    'Naufal Rizqullah Firdaus Projects',
    'Automation Projects',
    'IoT Integration Projects',
    'Solution Engineering Portfolio',
  ],
  openGraph: {
    title: 'Projects by NaufalRF',
    description:
      'A curated collection of projects by Naufal Rizqullah Firdaus that demonstrate solution engineering, system integration, automation logic, and scalable architecture design.',
    type: 'website',
    url: 'https://naufalrf.tech/projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects by NaufalRF',
    description:
      'A curated collection of projects by Naufal Rizqullah Firdaus that demonstrate solution engineering, system integration, automation logic, and scalable architecture design.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/projects',
  },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Projects"
          subtitle="A collection of projects showcasing my expertise in web development, mobile applications, backend systems, and DevOps practices. Each project represents real-world problem-solving and technical innovation."
          icon={FolderKanban}
        />

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <LoadingState type="skeleton" count={6} height="h-96" />
            </div>
          }
        >
          <ProjectsContent />
        </Suspense>
      </div>
    </div>
  );
}
