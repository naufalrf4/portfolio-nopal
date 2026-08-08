import { ArrowLeft, Calendar, ExternalLink, FolderKanban, GitBranch } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '../shared/Section';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
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
          className="inline-flex items-center gap-2 text-text-secondary hover:text-teal transition-colors mb-8 group"
          data-entity-type="project_back_link"
          data-entity-id={project.slug}
          data-entity-label="Back to projects"
          data-entity-url="/projects"
          {...reveal(0.02)}
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </motion.a>

        <div className="mx-auto max-w-[1380px]">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.82fr)] xl:gap-12">
            <motion.div className="min-w-0 space-y-8" {...reveal(0.06)}>
              <header className="max-w-4xl space-y-4">
                <h1 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl xl:text-[3.4rem] xl:leading-[1.05]">
                  {title}
                </h1>
              </header>

              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line">
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
                  <div className="flex h-full w-full items-center justify-center bg-bg-elevated">
                    <span className="text-7xl font-bold text-white opacity-80">
                      {title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="max-w-4xl rounded-xl border-l-4 border-teal bg-bg-card/60 px-6 py-5 border border-line">
                  <p className="whitespace-pre-line text-base italic leading-[1.9] text-text-secondary md:text-lg">
                    {project.description}
                  </p>
                </div>
              )}

              {hasArticleContent && (
                <section className="rounded-xl bg-bg-elevated p-3 md:p-4 border border-line">
                  <div className="max-h-[78vh] overflow-y-auto rounded-xl bg-bg-elevated px-6 py-8 border border-line md:px-10 md:py-10">
                    <ProjectArticle content={project.content} className="mx-auto max-w-4xl" />
                  </div>
                </section>
              )}
            </motion.div>

            <motion.aside className="min-w-0 xl:pt-8" {...reveal(0.14)}>
              <div className="space-y-5 xl:sticky xl:top-24">
                <Card className="p-7 md:p-8 homepage-card-hover">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                          Category
                        </p>
                        <div className="flex items-center gap-2 text-text-primary">
                          <FolderKanban size={16} className="text-teal" />
                          <Badge variant="accent" className="capitalize">
                            {project.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                          Date
                        </p>
                        <div className="flex items-center gap-2 text-text-primary">
                          <Calendar size={16} className="text-teal" />
                          <span className="font-medium">
                            {formatDate(project.projectDate || project.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {techStack.length > 0 && (
                      <div className="space-y-3 border-t border-line pt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                          Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {techStack.map((tech) => (
                            <Badge key={tech} size="sm">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {(project.liveUrl || project.repoUrl) && (
                  <div className="space-y-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        data-entity-type="project_live_demo"
                        data-entity-id={project.slug}
                        data-entity-label={`Live demo: ${title}`}
                        data-entity-url={project.liveUrl}
                      >
                        <Button
                          variant="accent"
                          className="w-full justify-center rounded-lg py-3"
                        >
                          <ExternalLink size={18} className="mr-2" />
                          View Live Demo
                        </Button>
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        data-entity-type="project_source_code"
                        data-entity-id={project.slug}
                        data-entity-label={`Source code: ${title}`}
                        data-entity-url={project.repoUrl}
                      >
                        <Button
                          variant="default"
                          className="w-full justify-center rounded-lg py-3"
                        >
                          <GitBranch size={18} className="mr-2" />
                          View Source Code
                        </Button>
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
