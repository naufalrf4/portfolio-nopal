import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsContent } from '@/src/features/projects/components/ProjectsContent';
import { LoadingState, PageHeader } from '@/src/features/shared/components';
import { FolderKanban } from 'lucide-react';

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
