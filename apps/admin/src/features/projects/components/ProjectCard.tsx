import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Pencil, Trash2, Wrench, ExternalLink, Github, Hash } from './Icons';
import { Switch } from '@/components/ui/switch';
import { getCategoryIcon } from '../utils/projects.utils';
import type { ProjectCardProps } from '../types/projects.types';

type ProjectWithImages = ProjectCardProps['project'] & {
  imageUrl?: string | null;
  images?: Array<{ url: string }>;
};

export function ProjectCard({
  project,
  index,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
}: ProjectCardProps) {
  const projectWithImages = project as ProjectWithImages;
  const CategoryIcon = getCategoryIcon(project.category);
  const imageUrl =
    projectWithImages.imageUrl ||
    (projectWithImages.images && projectWithImages.images.length > 0
      ? projectWithImages.images[0].url
      : null);

  return (
    <TooltipProvider>
      <div
        className="group relative rounded-[var(--radius-container)] p-6 bg-[var(--bg-elevated)] transition-all duration-300 hover:-translate-y-1"
        style={{
          boxShadow:
            '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
          animationDelay: `${index * 50}ms`,
        }}
      >
        {imageUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden bg-[var(--bg-elevated)] shadow-neu-inset-sm">
            <img src={imageUrl} alt={project.title} className="w-full h-40 object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--teal)]"
            style={{
              boxShadow:
                '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--teal)] transition-all duration-200 hover:shadow-neu-extruded-sm"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-red-500 transition-all duration-200 hover:shadow-neu-extruded-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{project.title}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{project.category}</p>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">{project.summary}</p>

        {project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="h-4 w-4 text-[var(--text-secondary)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs rounded-full bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  style={{
                    boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-3 py-1 text-xs rounded-full text-[var(--text-secondary)]">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <div className="mb-4 space-y-2">
            {project.liveUrl && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{new URL(project.liveUrl).hostname}</span>
              </div>
            )}
            {project.repoUrl && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <Github className="h-4 w-4" />
                <span className="truncate">Repository</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#A3B1C6]/20">
          <div className="flex items-center gap-2">
            <Switch
              checked={project.visible}
              onCheckedChange={onToggleVisibility}
              aria-label={project.visible ? 'Hide project' : 'Show project'}
            />
            <span className="text-xs text-[var(--text-secondary)]">
              {project.visible ? 'Visible' : 'Hidden'}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleFeatured}
                  className={`p-2 rounded-xl transition-colors ${
                    project.featured ? 'text-[var(--amber)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <Star className="h-4 w-4" fill={project.featured ? 'currentColor' : 'none'} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{project.featured ? 'Featured' : 'Not Featured'}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Hash className="h-4 w-4" />
            <span>{project.order}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
