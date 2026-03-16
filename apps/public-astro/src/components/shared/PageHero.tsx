import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function PageHero({ icon: Icon, title, description, className }: PageHeroProps) {
  return (
    <header className={cn('mb-12 text-center homepage-reveal', className)}>
      <div className="mb-6 flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E0E5EC] neu-extruded shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] md:h-20 md:w-20 homepage-card-hover homepage-reveal-pop">
          <Icon className="h-8 w-8 text-[#3B82F6] md:h-10 md:w-10" />
        </div>
        <h1
          className="text-3xl font-bold text-[#3D4852] md:text-4xl lg:text-5xl homepage-reveal-soft"
          style={{ animationDelay: '0.08s' }}
        >
          {title}
        </h1>
      </div>
      <p
        className="mx-auto max-w-3xl text-lg leading-relaxed text-[#6B7280] md:text-xl homepage-reveal-soft"
        style={{ animationDelay: '0.16s' }}
      >
        {description}
      </p>
    </header>
  );
}
