'use client';

import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface DetailFieldProps {
  label: string;
  value: ReactNode;
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div
      className="rounded-xl p-3 bg-[#E0E5EC]"
      style={{
        boxShadow:
          'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
      }}
    >
      <Label className="text-[#6B7280] text-xs mb-1 block">{label}</Label>
      <p className="text-[#3D4852] text-sm font-medium">{value}</p>
    </div>
  );
}
