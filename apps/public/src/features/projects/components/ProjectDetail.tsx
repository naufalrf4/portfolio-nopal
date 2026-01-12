import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Section, NeuCard, NeuBadge, NeuButton } from '@/src/features/shared/components';
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import type { Project } from './types';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="py-8 md:py-16">
      <Section>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#3B82F6] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)]">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-6xl text-white font-bold">{project.title.charAt(0)}</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3D4852] mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed">{project.summary}</p>
            </div>

            {project.description && (
              <NeuCard>
                <h2 className="text-xl font-bold text-[#3D4852] mb-4">About this Project</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              </NeuCard>
            )}

            {project.contexts && project.contexts.length > 0 && (
              <div className="space-y-6">
                {project.contexts.map((context) => (
                  <NeuCard key={context.id}>
                    <h3 className="text-lg font-bold text-[#3D4852] mb-3">{context.title}</h3>
                    <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">
                      {context.content}
                    </p>
                  </NeuCard>
                ))}
              </div>
            )}

            {project.images && project.images.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#3D4852] mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-video rounded-xl overflow-hidden shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)]"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || project.title}
                        fill
                        className="object-cover"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                          <p className="text-white text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <NeuCard>
                <h3 className="text-lg font-bold text-[#3D4852] mb-4">Project Info</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Category</p>
                    <NeuBadge variant="accent">{project.category}</NeuBadge>
                  </div>

                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Created</p>
                    <div className="flex items-center gap-2 text-[#3D4852]">
                      <Calendar size={16} />
                      {formatDate(project.createdAt)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#6B7280] mb-2">Tech Stack</p>
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
                    <NeuButton variant="accent" className="w-full">
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
                    <NeuButton variant="default" className="w-full">
                      <Github size={18} className="mr-2" />
                      View Source Code
                    </NeuButton>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
