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
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#E0E5EC] shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)] flex items-center justify-center">
          <Icon className="w-8 h-8 text-[#3B82F6]" />
        </div>
      )}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D4852] mb-6">{title}</h1>
      {subtitle && (
        <p className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}
