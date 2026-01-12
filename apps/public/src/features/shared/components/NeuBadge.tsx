import { cn } from '@/src/lib/utils';

interface NeuBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function NeuBadge({ children, variant = 'default', size = 'sm', className }: NeuBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        'shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]',
        size === 'sm' && 'px-3 py-1 text-xs',
        size === 'md' && 'px-4 py-1.5 text-sm',
        variant === 'default' && 'bg-[#E0E5EC] text-[#3D4852]',
        variant === 'accent' &&
          'bg-[#3B82F6] text-white shadow-[3px_3px_6px_rgba(59,130,246,0.3),-3px_-3px_6px_rgba(255,255,255,0.5)]',
        variant === 'outline' && 'bg-transparent border border-[#3B82F6] text-[#3B82F6]',
        className
      )}
    >
      {children}
    </span>
  );
}
