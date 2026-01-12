'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { NEU_BUTTON_SHADOW, NEU_BUTTON_PRESSED } from '../constants';

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  href: string;
  delay?: number;
}

export function QuickActionButton({ icon, label, href, delay = 0 }: QuickActionButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#E0E5EC] text-[#3D4852] font-medium text-sm transition-all duration-300 ease-out hover:-translate-y-0.5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        boxShadow: isPressed ? NEU_BUTTON_PRESSED : NEU_BUTTON_SHADOW,
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <span className="text-[#6B7280] group-hover:text-blue-500 transition-colors duration-300">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
