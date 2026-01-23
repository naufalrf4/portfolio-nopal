import { FeaturedProjects } from './FeaturedProjects';
import { projectsApi } from '@/src/lib/api/endpoints/projects';
import type { Project as ApiProject } from '@/src/lib/api/types';
import type { Project } from './types';

export async function FeaturedProjectsSection() {
  try {
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
      images: p.images || undefined,
      featured: p.featured,
      createdAt: p.createdAt,
    }));

    return <FeaturedProjects projects={mappedProjects} />;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return <FeaturedProjects projects={[]} />;
  }
}
