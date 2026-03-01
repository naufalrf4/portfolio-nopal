import { cn } from '../../lib/utils';
import React from 'react';

interface NeuCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function NeuCard({ children, className, hover = false, onClick, style }: NeuCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'bg-[#E0E5EC] rounded-2xl p-6',
        'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
        hover &&
          'transition-all duration-300 hover:shadow-[12px_12px_20px_rgba(163,177,198,0.7),-12px_-12px_20px_rgba(255,255,255,0.6)] hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
