import { cn } from '@/src/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function PageHeader({ title, subtitle, icon: Icon, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-12 text-center', className)}>
      <div className="flex flex-col items-center gap-6 mb-6">
        {Icon && (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl neu-extruded flex items-center justify-center">
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
