import type { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  message,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}
    >
      <div
        className={cn(
          'bg-[#E0E5EC] rounded-full p-6 mb-6',
          'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
        )}
      >
        {icon || <Inbox className="h-12 w-12 text-[#6B7280]" />}
      </div>

      <h3 className="text-xl font-semibold text-[#3D4852] mb-2">{title}</h3>
      <p className="text-[#6B7280] mb-6 max-w-md">{message}</p>

      {action && <div>{action}</div>}
    </div>
  );
}
