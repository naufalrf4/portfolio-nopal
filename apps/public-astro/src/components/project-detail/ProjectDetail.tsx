import { ArrowLeft, Calendar, ExternalLink, FolderKanban, GitBranch } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '../shared/Section';
import { NeuBadge } from '../shared/NeuBadge';
import { NeuButton } from '../shared/NeuButton';
import { NeuCard } from '../shared/NeuCard';
import { formatDate } from '../../lib/utils';
import type { Project } from '../../types';
import { ImageCarousel } from './ImageCarousel';
import { ProjectArticle } from './ProjectArticle';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const reduceMotion = useReducedMotion();
  const title = project.title?.trim() || 'Untitled Project';
  const images = project.images ?? [];
  const techStack = project.techStack ?? [];
  const hasArticleContent = Boolean(project.content?.trim());

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.18 },
          transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div className="py-8 md:py-16 animate-fade-in">
      <Section>
        <motion.a
          href="/projects"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#3B82F6] transition-colors mb-8 group"
          {...reveal(0.02)}
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </motion.a>

        <div className="mx-auto max-w-[1380px]">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.82fr)] xl:gap-12">
            <motion.div className="min-w-0 space-y-8" {...reveal(0.06)}>
              <header className="max-w-4xl space-y-4">
                <h1 className="text-3xl font-bold leading-tight text-[#3D4852] md:text-4xl xl:text-[3.4rem] xl:leading-[1.05]">
                  {title}
                </h1>
              </header>

              <div className="relative aspect-[16/9] overflow-hidden rounded-[32px] shadow-[14px_14px_28px_rgba(163,177,198,0.55),-14px_-14px_28px_rgba(255,255,255,0.5)]">
                {images.length > 0 ? (
                  <ImageCarousel images={images} title={title} />
                ) : project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]">
                    <span className="text-7xl font-bold text-white opacity-80">
                      {title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="max-w-4xl rounded-[28px] border-l-4 border-[#3B82F6] bg-white/35 px-6 py-5 shadow-[inset_4px_4px_10px_rgba(163,177,198,0.2),inset_-4px_-4px_10px_rgba(255,255,255,0.35)]">
                  <p className="whitespace-pre-line text-base italic leading-[1.9] text-[#5B6470] md:text-lg">
                    {project.description}
                  </p>
                </div>
              )}

              {hasArticleContent && (
                <section className="rounded-[32px] bg-[#E0E5EC] p-3 md:p-4 shadow-[inset_8px_8px_16px_rgba(163,177,198,0.35),inset_-8px_-8px_16px_rgba(255,255,255,0.5)]">
                  <div className="max-h-[78vh] overflow-y-auto rounded-[24px] bg-[#E7ECF2] px-6 py-8 shadow-[10px_10px_20px_rgba(163,177,198,0.3),-10px_-10px_20px_rgba(255,255,255,0.45)] md:px-10 md:py-10">
                    <ProjectArticle content={project.content} className="mx-auto max-w-4xl" />
                  </div>
                </section>
              )}
            </motion.div>

            <motion.aside className="min-w-0 xl:pt-8" {...reveal(0.14)}>
              <div className="space-y-5 xl:sticky xl:top-24">
                <NeuCard className="p-7 md:p-8 homepage-card-hover">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                          Category
                        </p>
                        <div className="flex items-center gap-2 text-[#3D4852]">
                          <FolderKanban size={16} className="text-[#3B82F6]" />
                          <NeuBadge variant="accent" className="capitalize">
                            {project.category}
                          </NeuBadge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                          Date
                        </p>
                        <div className="flex items-center gap-2 text-[#3D4852]">
                          <Calendar size={16} className="text-[#3B82F6]" />
                          <span className="font-medium">
                            {formatDate(project.projectDate || project.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {techStack.length > 0 && (
                      <div className="space-y-3 border-t border-[#A3B1C6]/35 pt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                          Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {techStack.map((tech) => (
                            <NeuBadge key={tech} size="sm">
                              {tech}
                            </NeuBadge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </NeuCard>

                {(project.liveUrl || project.repoUrl) && (
                  <div className="space-y-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <NeuButton
                          variant="accent"
                          className="w-full justify-center rounded-[18px] py-3"
                        >
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
                        <NeuButton
                          variant="default"
                          className="w-full justify-center rounded-[18px] py-3"
                        >
                          <GitBranch size={18} className="mr-2" />
                          View Source Code
                        </NeuButton>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </Section>
    </div>
  );
}
