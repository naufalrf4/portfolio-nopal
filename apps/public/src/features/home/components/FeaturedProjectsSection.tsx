'use client';

import { useEffect, useState } from 'react';
import { FeaturedProjects } from './FeaturedProjects';
import { LoadingState, ErrorState, Section } from '@/src/features/shared/components';
import { projectsApi } from '@/src/lib/api/endpoints/projects';
import type { Project as ApiProject } from '@/src/lib/api/types';
import type { Project } from './types';

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsApi.getAll({ featured: true, limit: 3 });
      const mappedProjects: Project[] = (response.projects || []).map((p: ApiProject) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description || undefined,
        category: p.category,
        techStack: p.techStack,
        liveUrl: p.liveUrl || undefined,
        repoUrl: p.repoUrl || undefined,
        imageUrl: p.imageUrl || undefined,
        featured: p.featured,
        createdAt: p.createdAt,
      }));
      setProjects(mappedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load featured projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Section>
        <div className="py-12">
          <LoadingState type="skeleton" count={3} height="h-64" />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <ErrorState title="Failed to load projects" message={error} onRetry={fetchData} />
      </Section>
    );
  }

  return <FeaturedProjects projects={projects} />;
}
