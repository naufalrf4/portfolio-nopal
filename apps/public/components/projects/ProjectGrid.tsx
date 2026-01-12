'use client';

import { useState, useMemo } from 'react';
import type { Project, ProjectCategory } from '@naufalrf/types';
import { ProjectCard } from './ProjectCard';
import { ProjectFilter } from './ProjectFilter';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projects;
    }
    return projects.filter((project) =>
      project.category.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }, [projects, activeCategory]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="neu-card max-w-md text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">No Projects Yet</h3>
          <p className="text-muted-foreground">Check back soon for exciting projects!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProjectFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="neu-card max-w-md text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">No Projects Found</h3>
            <p className="text-muted-foreground">
              No projects in the {activeCategory} category yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
