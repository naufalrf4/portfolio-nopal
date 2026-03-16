import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 text-center homepage-reveal', className)}>
      <h2
        className="text-3xl md:text-4xl font-bold text-[#3D4852] mb-4 homepage-reveal-soft"
        style={{ animationDelay: '0.08s' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-lg text-[#6B7280] max-w-2xl mx-auto homepage-reveal-soft"
          style={{ animationDelay: '0.18s' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
