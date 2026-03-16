import { Section } from '@/components/shared/Section';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { NeuCard } from '@/components/shared/NeuCard';
import { Globe, Brain, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

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
    title: 'AI & Automation',
    description:
      'Implementing intelligent solutions using Large Language Models, RAG systems, and automation pipelines. Creating AI-powered applications that streamline workflows and solve real-world problems.',
    technologies: ['LLMs', 'RAG', 'Python', 'LangChain', 'Automation'],
  },
  {
    icon: Cpu,
    title: 'IoT & Hardware',
    description:
      'Designing embedded systems and IoT solutions that bridge the physical and digital worlds. Building connected devices with sensors, microcontrollers, and real-time communication.',
    technologies: ['Arduino', 'ESP32', 'Raspberry Pi', 'MQTT', 'Sensors'],
  },
];

export function TechnicalExpertise() {
  return (
    <Section className="homepage-reveal-soft">
      <SectionHeader
        title="Technical Expertise"
        subtitle="Areas of specialization and technical skills I bring to every project"
      />

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
        {expertiseAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={index}
              className="min-w-[280px] w-[280px] flex-shrink-0 snap-start md:min-w-0 md:w-auto md:flex-shrink"
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.12 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <NeuCard hover className="h-full group homepage-card-hover">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] flex items-center justify-center mb-4 transition-transform duration-500 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#3B82F6] transition-transform duration-500 ease-out group-hover:scale-[1.12] group-hover:-translate-y-0.5" />
                  </div>

                  <h3 className="text-xl font-bold text-[#3D4852] mb-2 md:text-2xl">
                    {area.title}
                  </h3>

                  <p className="text-sm text-[#6B7280] leading-relaxed mb-4 flex-1 md:text-base">
                    {area.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {area.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2.5 py-1 text-xs font-medium text-[#3B82F6] bg-[#E0E5EC] rounded-full shadow-[2px_2px_4px_rgba(163,177,198,0.6),-2px_-2px_4px_rgba(255,255,255,0.5)] homepage-pill-hover"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </NeuCard>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
