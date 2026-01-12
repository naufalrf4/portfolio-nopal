'use client';

import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: import('react').ReactNode;
  label?: string;
  show?: boolean;
}

export function FloatingActionButton({
  onClick,
  icon,
  label = 'Add new item',
  show = true,
}: FloatingActionButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={[
        'fixed bottom-28 right-6 z-30',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]',
        'flex items-center justify-center',
        'text-white',
        '[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
        'hover:scale-110 hover:[box-shadow:12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)]',
        'active:scale-95',
        'transition-all duration-300 ease-out',
        'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50',
        'block md:hidden',
      ].join(' ')}
    >
      {icon || <Plus className="w-6 h-6" strokeWidth={2.5} />}
    </button>
  );
}
