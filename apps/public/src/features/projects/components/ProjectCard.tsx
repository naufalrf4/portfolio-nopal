import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { NeuCard, NeuBadge } from '@/src/features/shared/components';
import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <NeuCard hover className="h-full group">
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-4xl text-white font-bold">{project.title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold text-[#3D4852] group-hover:text-[#3B82F6] transition-colors">
            {project.title}
          </h3>
          <NeuBadge variant="accent" size="sm">
            {project.category}
          </NeuBadge>
        </div>

        <p className="text-[#6B7280] mb-4 line-clamp-2">{project.summary}</p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech, index) => (
            <NeuBadge key={index} size="sm">
              {tech}
            </NeuBadge>
          ))}
          {project.techStack.length > 4 && (
            <NeuBadge size="sm">+{project.techStack.length - 4}</NeuBadge>
          )}
        </div>
      </NeuCard>
    </Link>
  );
}
