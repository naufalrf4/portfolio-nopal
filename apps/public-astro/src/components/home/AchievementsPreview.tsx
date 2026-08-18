import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { BlurFade } from '@/components/ui/BlurFade';
import type { Achievement } from '@/types';

interface AchievementsPreviewProps {
  achievements?: Achievement[];
}

export function AchievementsPreview({ achievements }: AchievementsPreviewProps) {
  const items = (achievements ?? []).slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section data-scene="circuit" className="relative w-full border-t border-line py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade direction="up" offset={24} className="mb-12 flex flex-col items-start">
          <span className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-teal">
            03 — Recognition
          </span>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Achievements
            </h2>
            <a
              href="/about#achievements"
              className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-text-secondary transition-colors hover:text-text-primary"
            >
              View All
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((achievement, index) => (
            <BlurFade key={achievement.id} direction="up" offset={24} delay={index * 0.08} className="h-full">
              <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-line p-0 transition-colors duration-500 hover:border-line-hover">
                {achievement.photos?.[0] && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={achievement.photos[0]}
                      alt={achievement.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                    {achievement.monthYear} · {achievement.location}
                  </span>
                  <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold text-text-primary">
                    {achievement.name}
                  </h3>
                </div>
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
