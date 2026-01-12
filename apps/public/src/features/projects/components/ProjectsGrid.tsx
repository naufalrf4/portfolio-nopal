'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { ProjectCard } from './ProjectCard';
import type { Project } from './types';

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const projectCount = filteredProjects.length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const count =
            category === 'All'
              ? projects.length
              : projects.filter((p) => p.category === category).length;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={isActive}
              className={cn(
                'px-5 py-2.5 rounded-2xl font-medium transition-all duration-300 capitalize',
                'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]',
                isActive
                  ? 'text-[#3B82F6] bg-[#E0E5EC] shadow-[inset_6px_6px_10px_rgba(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]'
                  : 'text-[#6B7280] bg-[#E0E5EC] shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] hover:text-[#3B82F6] hover:-translate-y-0.5 hover:shadow-[8px_8px_16px_rgba(163,177,198,0.7),-8px_-8px_16px_rgba(255,255,255,0.6)]'
              )}
            >
              {category}
              <span
                className={cn(
                  'ml-2 text-xs px-2 py-0.5 rounded-full',
                  isActive ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#6B7280]/10 text-[#6B7280]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {projectCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#6B7280]">No projects found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="stagger-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
