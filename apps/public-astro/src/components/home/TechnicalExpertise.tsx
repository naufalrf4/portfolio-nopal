import { IconCloud } from '@/components/ui/IconCloud';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { BlurFade } from '@/components/ui/BlurFade';
import { BorderBeam } from '@/components/ui/BorderBeam';

type BadgeTone = 'accent' | 'neutral' | 'outline';

interface SkillGroup {
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly { readonly label: string; readonly tone: BadgeTone }[];
}

const skillGroups: readonly SkillGroup[] = [
  {
    title: 'Web & App Engineering',
    description:
      'Modern, responsive web and cross-platform app development with type-safe, scalable architectures.',
    technologies: [
      { label: 'React', tone: 'accent' },
      { label: 'Next.js', tone: 'neutral' },
      { label: 'TypeScript', tone: 'accent' },
      { label: 'Node.js', tone: 'outline' },
      { label: 'TailwindCSS', tone: 'neutral' },
      { label: 'Rust', tone: 'accent' },
      { label: 'Tauri', tone: 'outline' },
    ],
  },
  {
    title: 'AI & Agentic Systems',
    description:
      'LLM-driven automation: RAG pipelines, multi-step agent orchestration, and AI-assisted workflows.',
    technologies: [
      { label: 'LLMs', tone: 'accent' },
      { label: 'RAG', tone: 'neutral' },
      { label: 'AI Agents', tone: 'accent' },
      { label: 'LangChain', tone: 'outline' },
      { label: '0penAI', tone: 'neutral' },
      { label: 'Python', tone: 'accent' },
      { label: 'n8n', tone: 'outline' },
    ],
  },
  {
    title: 'IoT & Embedded',
    description:
      'Connected devices and embedded systems bridging physical sensors with real-time software.',
    technologies: [
      { label: 'ESP32', tone: 'accent' },
      { label: 'Arduino', tone: 'neutral' },
      { label: 'Raspberry Pi', tone: 'outline' },
      { label: 'MQTT', tone: 'accent' },
      { label: 'Sensors', tone: 'neutral' },
    ],
  },
  {
    title: 'Cloud & Tooling',
    description:
      'Deployment, infrastructure, and the daily-driver toolchain that keeps systems running.',
    technologies: [
      { label: 'AWS', tone: 'accent' },
      { label: 'Docker', tone: 'outline' },
      { label: 'PostgreSQL', tone: 'neutral' },
      { label: 'Git', tone: 'accent' },
      { label: 'Linux', tone: 'neutral' },
    ],
  },
];

const badgeClass: Record<BadgeTone, string> = {
  accent:
    'rounded-full border border-teal/40 bg-teal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-teal transition-colors hover:border-teal/70',
  neutral:
    'rounded-md border border-line bg-bg-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-line-hover hover:text-text-primary',
  outline:
    'rounded-md border border-dashed border-line bg-transparent px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:border-line-hover hover:text-text-secondary',
};

const cloudIcons = [
  'https://cdn.simpleicons.org/react',
  'https://cdn.simpleicons.org/nextdotjs/ffffff',
  'https://cdn.simpleicons.org/typescript',
  'https://cdn.simpleicons.org/nodedotjs',
  'https://cdn.simpleicons.org/tailwindcss',
  'https://cdn.simpleicons.org/rust',
  'https://cdn.simpleicons.org/tauri',
  'https://cdn.simpleicons.org/python',
  'https://cdn.simpleicons.org/langchain/ffffff',
  'https://cdn.simpleicons.org/openai/ffffff',
  'https://cdn.simpleicons.org/arduino',
  'https://cdn.simpleicons.org/espressif',
  'https://cdn.simpleicons.org/raspberrypi',
  'https://cdn.simpleicons.org/mqtt',
  'https://cdn.simpleicons.org/amazonwebservices',
  'https://cdn.simpleicons.org/docker',
  'https://cdn.simpleicons.org/postgresql',
  'https://cdn.simpleicons.org/git',
  'https://cdn.simpleicons.org/linux',
  'https://cdn.simpleicons.org/n8n',
] as const;

export function TechnicalExpertise() {
  return (
    <section data-scene="circuit" className="relative w-full border-t border-teal/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left column — heading, stats, grouped stack */}
          <div className="flex flex-col gap-10">
            <BlurFade delay={0.1} inView>
              <div className="flex flex-col gap-5">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal">
                  01 — Domains & Stack
                </span>
                <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
                  Technical Expertise
                </h2>
                <p className="max-w-md text-base leading-relaxed text-text-secondary">
                  Integrated systems across software, cloud, IoT, and AI — spun into a single rotating stack.
                </p>
                <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  <span className="text-3xl font-bold text-teal md:text-4xl">
                    0<NumberTicker value={skillGroups.length} />
                  </span>
                  <span>domains</span>
                  <span className="mx-2 inline-block h-px w-8 bg-line" />
                  <span className="text-3xl font-bold text-text-primary md:text-4xl">
                    <NumberTicker value={cloudIcons.length} />+
                  </span>
                  <span>stack depth</span>
                </div>
              </div>
            </BlurFade>

            <div className="flex flex-col gap-6 border-t border-line pt-8">
              {skillGroups.map((group, index) => (
                <BlurFade key={group.title} delay={0.15 + index * 0.1} inView>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-teal">
                        0{index + 1}
                      </span>
                      <h3 className="font-display text-lg font-bold text-text-primary">
                        {group.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-text-tertiary">{group.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.technologies.map((tech) => (
                        <span key={tech.label} className={badgeClass[tech.tone]}>
                          {tech.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>

          {/* Right column — interactive 3D icon cloud */}
          <BlurFade delay={0.3} inView className="flex w-full items-center justify-center lg:justify-end">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-card p-4">
              <IconCloud size={400} images={[...cloudIcons]} />
              <BorderBeam size={140} duration={12} colorFrom="var(--teal)" colorTo="var(--bg-elevated)" />
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
