'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@naufalrf/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <article className="neu-card h-full hover:neu-extruded-hover cursor-pointer">
          {project.imageUrl && (
            <div className="w-full h-48 mb-4 overflow-hidden rounded-2xl neu-inset">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
            {project.featured && (
              <span className="neu-inset px-3 py-1 rounded-lg text-xs font-medium text-primary">
                Featured
              </span>
            )}
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.summary}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="neu-inset px-3 py-1 rounded-lg text-xs font-medium text-foreground"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="neu-inset px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="neu-inset px-3 py-1 rounded-lg">{project.category}</span>
            <span>
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
