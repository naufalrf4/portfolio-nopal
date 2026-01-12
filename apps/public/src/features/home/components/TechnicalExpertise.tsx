import { cn } from '@/src/lib/utils';
import { Section, SectionHeader, NeuCard } from '@/src/features/shared/components';
import { Globe, Brain, Cloud } from 'lucide-react';

const expertiseAreas = [
  {
    icon: Globe,
    title: 'Web Development',
    description:
      'Building modern, responsive web applications with cutting-edge technologies. Expertise in creating scalable frontend architectures and intuitive user experiences.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'],
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description:
      'Implementing intelligent solutions using Large Language Models, RAG systems, and ML pipelines. Creating AI-powered applications that solve real-world problems.',
    technologies: ['LLMs', 'RAG', 'Embeddings', 'Python', 'LangChain'],
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description:
      'Designing and deploying cloud infrastructure with focus on scalability, reliability, and security. Implementing CI/CD pipelines and containerized applications.',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
  },
];

export function TechnicalExpertise() {
  return (
    <Section className="bg-[#E0E5EC]">
      <SectionHeader
        title="Technical Expertise"
        subtitle="Areas of specialization and technical skills I bring to every project"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {expertiseAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <NeuCard key={index} hover className="h-full">
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#3B82F6]" />
                </div>

                <h3 className="text-xl font-bold text-[#3D4852] mb-3">{area.title}</h3>

                <p className="text-[#6B7280] leading-relaxed mb-6 flex-1">{area.description}</p>

                <div className="flex flex-wrap gap-2">
                  {area.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs font-medium text-[#3B82F6] bg-[#E0E5EC] rounded-full shadow-[2px_2px_4px_rgba(163,177,198,0.6),-2px_-2px_4px_rgba(255,255,255,0.5)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </NeuCard>
          );
        })}
      </div>
    </Section>
  );
}
