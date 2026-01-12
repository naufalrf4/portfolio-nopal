import type { Metadata } from 'next';
import { ProjectDetailPageContent } from './components/ProjectDetailPageContent';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Project Details - ${id}`,
    description: 'View and manage project details, contexts, and related information',
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <ProjectDetailPageContent projectId={id} />;
}
