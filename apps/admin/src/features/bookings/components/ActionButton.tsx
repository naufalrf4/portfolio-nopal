'use client';

import type { ReactNode } from 'react';

interface ActionButtonProps {
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
  hoverColor?: string;
}

export function ActionButton({
  icon,
  tooltip,
  onClick,
  hoverColor = '#3B82F6',
}: ActionButtonProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] transition-colors"
        style={{
          boxShadow: '3px 3px 6px rgba(163,177,198,0.4), -3px -3px 6px rgba(255,255,255,0.4)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#6B7280';
        }}
      >
        {icon}
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#3D4852] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
}
