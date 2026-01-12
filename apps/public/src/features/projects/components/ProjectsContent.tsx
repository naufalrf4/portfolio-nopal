'use client';

import { useState, useEffect } from 'react';
import { defaultClient } from '@naufalrf/sdk';
import { ProjectsGrid } from './ProjectsGrid';
import { ErrorState, LoadingState } from '@/src/features/shared/components';
import type { Project } from './types';

export function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await defaultClient.projects.getAll();
      const fetchedProjects = response.data?.projects || [];

      const serializedProjects = fetchedProjects.map((project) => ({
        ...project,
        createdAt:
          project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
        updatedAt:
          project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
      }));

      setProjects(serializedProjects);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load projects. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LoadingState type="skeleton" count={6} height="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load projects"
        message={error}
        onRetry={fetchProjects}
        showRetry={true}
      />
    );
  }

  return <ProjectsGrid projects={projects} />;
}
