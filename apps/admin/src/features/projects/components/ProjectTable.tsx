import { Eye, EyeOff, Star, Pencil, Trash2 } from './Icons';
import { NEUMORPHIC_STYLES } from '../constants/projects.constants';
import type { ProjectTableProps } from '../types/projects.types';

export function ProjectTable({
  projects,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
}: ProjectTableProps) {
  return (
    <div
      className="rounded-[32px] overflow-hidden bg-[#E0E5EC]"
      style={{
        boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#A3B1C6]/20">
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Project</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">
                Tech Stack
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#3D4852]">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#3D4852]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-[#A3B1C6]/10 last:border-0">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-[#3D4852]">{project.title}</p>
                    <p className="text-sm text-[#6B7280] line-clamp-1">{project.summary}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6B7280]">{project.category}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs rounded-full bg-[#E0E5EC] text-[#3D4852]"
                        style={{
                          boxShadow: NEUMORPHIC_STYLES.shadows.insetTiny,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 2 && (
                      <span className="text-xs text-[#6B7280]">
                        +{project.techStack.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onToggleVisibility(project)}>
                      {project.visible ? (
                        <Eye className="h-4 w-4 text-[#38B2AC]" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-[#6B7280]" />
                      )}
                    </button>
                    <button onClick={() => onToggleFeatured(project)}>
                      <Star
                        className="h-4 w-4"
                        fill={project.featured ? '#F59E0B' : 'none'}
                        stroke={project.featured ? '#F59E0B' : '#6B7280'}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
