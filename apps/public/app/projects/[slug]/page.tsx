import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectDetail } from '@/src/features/projects/components';
import { ProjectViewTracker } from '@/src/components/projects/ProjectViewTracker';

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
  try {
    const response = await defaultClient.projects.getBySlug(slug);
    return response.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const title = project.title;
  const description = project.summary;
  const url = `https://naufalrf.tech/projects/${project.slug}`;
  const keywords = [
    'NaufalRF',
    'Naufal Rizqullah Firdaus',
    'Software Engineer Indonesia',
    'Full Stack Developer Indonesia',
    'Solution Engineering Portfolio',
    ...(project.techStack ?? []),
    ...(project.tags ?? []),
  ].filter((keyword) => Boolean(keyword));

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | NaufalRF`,
      description,
      type: 'article',
      url,
      images: project.imageUrl
        ? [
            {
              url: project.imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | NaufalRF`,
      description,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const serializedProject = {
    ...project,
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
    contexts: project.contexts?.map((ctx) => ({
      ...ctx,
      createdAt: ctx.createdAt instanceof Date ? ctx.createdAt : new Date(ctx.createdAt),
      updatedAt: ctx.updatedAt instanceof Date ? ctx.updatedAt : new Date(ctx.updatedAt),
    })),
  };

  return (
    <>
      <ProjectViewTracker projectId={project.id} slug={project.slug} />
      <ProjectDetail project={serializedProject} />
    </>
  );
}
