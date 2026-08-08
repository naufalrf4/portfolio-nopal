import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: 'base' | 'elevated';
}

export function Section({ children, className, id, tone = 'base' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden',
        tone === 'elevated' && 'bg-bg-elevated border-y border-line',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
