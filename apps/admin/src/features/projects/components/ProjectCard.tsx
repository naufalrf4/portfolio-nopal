import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, EyeOff, Star, Pencil, Trash2, Wrench, ExternalLink, Github, Hash } from './Icons';
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
        className="group relative rounded-[32px] p-6 bg-[#E0E5EC] transition-all duration-300 hover:-translate-y-1"
        style={{
          boxShadow:
            '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
          animationDelay: `${index * 50}ms`,
        }}
      >
        {imageUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]">
            <img src={imageUrl} alt={project.title} className="w-full h-40 object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-2xl bg-[#E0E5EC] text-[#3B82F6]"
            style={{
              boxShadow:
                '8px 8px 16px rgba(163, 177, 198, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.5)',
            }}
          >
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 hover:shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]"
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
                  className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-red-500 transition-all duration-200 hover:shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[#3D4852] mb-1">{project.title}</h3>
          <p className="text-sm text-[#6B7280]">{project.category}</p>
        </div>

        <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{project.summary}</p>

        {project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="h-4 w-4 text-[#6B7280]" />
              <span className="text-xs font-medium text-[#6B7280]">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs rounded-full bg-[#E0E5EC] text-[#3D4852]"
                  style={{
                    boxShadow:
                      'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
                  }}
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-3 py-1 text-xs rounded-full text-[#6B7280]">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <div className="mb-4 space-y-2">
            {project.liveUrl && (
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{new URL(project.liveUrl).hostname}</span>
              </div>
            )}
            {project.repoUrl && (
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Github className="h-4 w-4" />
                <span className="truncate">Repository</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#A3B1C6]/20">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleVisibility}
                  className={`p-2 rounded-xl transition-colors ${
                    project.visible ? 'text-[#38B2AC]' : 'text-[#6B7280]'
                  }`}
                >
                  {project.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{project.visible ? 'Visible' : 'Hidden'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleFeatured}
                  className={`p-2 rounded-xl transition-colors ${
                    project.featured ? 'text-[#F59E0B]' : 'text-[#6B7280]'
                  }`}
                >
                  <Star className="h-4 w-4" fill={project.featured ? 'currentColor' : 'none'} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{project.featured ? 'Featured' : 'Not Featured'}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Hash className="h-4 w-4" />
            <span>{project.order}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
