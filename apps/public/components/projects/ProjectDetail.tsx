import Link from 'next/link';
import type { Project } from '@naufalrf/types';
import { ContextSection } from './ContextSection';
import { TechBadge } from './TechBadge';
import { ProjectLinks } from './ProjectLinks';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span>←</span>
            <span>Back to Projects</span>
          </Link>
        </nav>

        <article>
          <header className="mb-12">
            {project.imageUrl && (
              <div className="w-full h-64 md:h-96 mb-8 overflow-hidden rounded-3xl neu-inset">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="neu-inset px-4 py-2 rounded-xl text-sm font-medium text-foreground">
                {project.category}
              </span>
              {project.featured && (
                <span className="neu-inset px-4 py-2 rounded-xl text-sm font-medium text-primary">
                  Featured
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{project.title}</h1>

            <p className="text-xl text-muted-foreground mb-8">{project.summary}</p>

            <div className="neu-card mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            </div>

            <ProjectLinks liveUrl={project.liveUrl} repoUrl={project.repoUrl} />
          </header>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
            <div className="neu-card prose prose-sm max-w-none text-muted-foreground">
              <div
                dangerouslySetInnerHTML={{
                  __html: project.description.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          </div>

          {project.contexts && project.contexts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Project Details</h2>
              {project.contexts
                .sort((a, b) => a.order - b.order)
                .map((context) => (
                  <ContextSection key={context.id} context={context} />
                ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
