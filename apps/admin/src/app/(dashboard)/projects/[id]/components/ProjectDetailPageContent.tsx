'use client';

import ProjectForm from '@/components/projects/ProjectForm';
import ContextManager from '@/components/projects/ContextManager';

interface ProjectDetailPageContentProps {
  projectId: string;
}

export function ProjectDetailPageContent({ projectId }: ProjectDetailPageContentProps) {
  return (
    <div className="space-y-6">
      <ProjectForm projectId={projectId} />
      <ContextManager projectId={projectId} />
    </div>
  );
}
