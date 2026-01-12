import Image from 'next/image';
import Link from 'next/link';
import {
  Section,
  SectionHeader,
  NeuCard,
  NeuBadge,
  NeuButton,
} from '@/src/features/shared/components';
import { ArrowRight } from 'lucide-react';
import type { Project } from './types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader
        title="Featured Projects"
        subtitle="A selection of projects that showcase my skills and passion for building"
      />

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
        {featuredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="min-w-[280px] w-[280px] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:flex-shrink"
          >
            <NeuCard hover className="h-full group p-4">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">{project.title.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-[#3D4852] group-hover:text-[#3B82F6] transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <NeuBadge variant="accent" size="sm">
                  {project.category}
                </NeuBadge>
              </div>

              <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{project.summary}</p>

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 3).map((tech, index) => (
                  <NeuBadge key={index} size="sm">
                    {tech}
                  </NeuBadge>
                ))}
                {project.techStack.length > 3 && (
                  <NeuBadge size="sm">+{project.techStack.length - 3}</NeuBadge>
                )}
              </div>
            </NeuCard>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/projects">
          <NeuButton variant="default" size="lg">
            View All Projects
            <ArrowRight className="ml-2 w-5 h-5" />
          </NeuButton>
        </Link>
      </div>
    </Section>
  );
}
