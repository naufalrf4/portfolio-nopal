import type { ElementType } from 'react';
import { Section } from '../shared/Section';
import { NeuCard } from '../shared/NeuCard';
import { NeuBadge } from '../shared/NeuBadge';
import { NeuButton } from '../shared/NeuButton';
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Calendar,
  Lightbulb,
  User,
  Scale,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { Project, ProjectContext } from '../../types';
import { ImageCarousel } from './ImageCarousel';

interface ProjectDetailProps {
  project: Project;
}

const CONTEXT_TYPE_CONFIG: Record<string, { icon: ElementType; label: string; order: number }> = {
  CONTEXT: { icon: Lightbulb, label: 'Context & Background', order: 1 },
  ROLE: { icon: User, label: 'My Role', order: 2 },
  ARCHITECTURE: { icon: FileText, label: 'Technical Decisions', order: 3 },
  TRADEOFFS: { icon: Scale, label: 'Trade-offs', order: 4 },
  RESULT: { icon: TrendingUp, label: 'Results & Impact', order: 5 },
};

function ContextSection({ context }: { context: ProjectContext }) {
  const config = CONTEXT_TYPE_CONFIG[context.type] || {
    icon: FileText,
    label: context.title,
    order: 99,
  };
  const Icon = config.icon;

  return (
    <article className="group">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
          <Icon size={20} className="text-[#3B82F6]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#3D4852] mb-1">{context.title}</h3>
          <span className="text-xs font-medium text-[#3B82F6] uppercase tracking-wider">
            {config.label}
          </span>
        </div>
      </div>
      <div className="pl-14">
        <p className="text-[#6B7280] text-lg leading-[1.8] whitespace-pre-line">
          {context.content}
        </p>
      </div>
    </article>
  );
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const sortedContexts = project.contexts
    ? [...project.contexts].sort((a, b) => {
        const orderA = CONTEXT_TYPE_CONFIG[a.type]?.order ?? 99;
        const orderB = CONTEXT_TYPE_CONFIG[b.type]?.order ?? 99;
        return orderA - orderB;
      })
    : [];

  return (
    <div className="py-8 md:py-16 animate-fade-in">
      <Section>
        <a
          href="/projects"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#3B82F6] transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-10">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)]">
              {project.images && project.images.length > 0 ? (
                <ImageCarousel images={project.images} title={project.title} />
              ) : project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-7xl text-white font-bold opacity-80">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <header className="max-w-prose">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3D4852] mb-6 leading-tight">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#6B7280] leading-relaxed font-light">
                {project.summary}
              </p>
            </header>

            {project.description && (
              <div className="max-w-prose">
                <div className="border-l-4 border-[#3B82F6] pl-6 py-2">
                  <p className="text-lg text-[#6B7280] leading-[1.8] whitespace-pre-line italic">
                    {project.description}
                  </p>
                </div>
              </div>
            )}

            {sortedContexts.length > 0 && (
              <div className="space-y-10 max-w-prose">
                <div className="h-px bg-gradient-to-r from-transparent via-[#A3B1C6] to-transparent" />
                {sortedContexts.map((context, index) => (
                  <div key={context.id}>
                    <ContextSection context={context} />
                    {index < sortedContexts.length - 1 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-[#A3B1C6]/50 to-transparent mt-10" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {project.images && project.images.length > 0 && (
              <div className="pt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-[#A3B1C6] to-transparent mb-10" />
                <h2 className="text-2xl font-bold text-[#3D4852] mb-8">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((image) => (
                    <figure
                      key={image.id}
                      className="group relative aspect-video rounded-xl overflow-hidden shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] transition-all duration-300 hover:shadow-[12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {image.caption && (
                        <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                          <p className="text-white text-sm font-medium">{image.caption}</p>
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <NeuCard className="p-6">
                <h3 className="text-lg font-bold text-[#3D4852] mb-5">Project Details</h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                      Category
                    </p>
                    <NeuBadge variant="accent" className="capitalize">
                      {project.category}
                    </NeuBadge>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                      Date
                    </p>
                    <div className="flex items-center gap-2 text-[#3D4852]">
                      <Calendar size={16} className="text-[#6B7280]" />
                      <span className="font-medium">
                        {formatDate(project.projectDate || project.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-3">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <NeuBadge key={index} size="sm">
                          {tech}
                        </NeuBadge>
                      ))}
                    </div>
                  </div>
                </div>
              </NeuCard>

              <div className="space-y-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <NeuButton variant="accent" className="w-full justify-center">
                      <ExternalLink size={18} className="mr-2" />
                      View Live Demo
                    </NeuButton>
                  </a>
                )}

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <NeuButton variant="default" className="w-full justify-center">
                      <GitBranch size={18} className="mr-2" />
                      View Source Code
                    </NeuButton>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
