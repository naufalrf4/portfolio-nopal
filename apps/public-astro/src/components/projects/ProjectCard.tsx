import { NeuCard } from '../shared/NeuCard';
import { NeuBadge } from '../shared/NeuBadge';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const title = project.title?.trim() || 'Untitled Project';
  const techStack = project.techStack ?? [];
  // Use imageUrl first, fallback to first image from images array, then fallback to gradient
  const thumbnailUrl = project.imageUrl || project.images?.[0]?.url;

  return (
    <a href={`/projects/${project.slug}`} className="block h-full group no-underline">
      <NeuCard hover className="h-full">
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={project.images?.[0]?.alt || title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-4xl text-white font-bold">{title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-[#3D4852] group-hover:text-[#3B82F6] transition-colors">
            {title}
          </h3>
          <NeuBadge variant="accent" size="sm">
            {project.category}
          </NeuBadge>
        </div>

        <p className="text-[#6B7280] mb-4 line-clamp-2">{project.summary}</p>

        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 4).map((tech, index) => (
            <NeuBadge key={index} size="sm">
              {tech}
            </NeuBadge>
          ))}
          {techStack.length > 4 && <NeuBadge size="sm">+{techStack.length - 4}</NeuBadge>}
        </div>
      </NeuCard>
    </a>
  );
}
