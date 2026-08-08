import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 text-center', className)} data-reveal>
      <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-text-secondary max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
