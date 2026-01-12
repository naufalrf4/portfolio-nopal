'use client';

import { useEffect } from 'react';
import { trackProjectView } from '@/lib/analytics/tracker';

interface ProjectViewTrackerProps {
  projectId: string;
  projectTitle: string;
}

export function ProjectViewTracker({ projectId, projectTitle }: ProjectViewTrackerProps): null {
  useEffect(() => {
    trackProjectView(projectId, projectTitle);
  }, [projectId, projectTitle]);

  return null;
}
