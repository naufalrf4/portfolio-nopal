'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { NEU_INSET_SHADOW } from '../constants';

export function AnalyticsSummaryCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
      className={`p-6 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-400/20 to-cyan-500/20"
            style={{ boxShadow: NEU_INSET_SHADOW }}
          >
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Analytics Overview</p>
            <p className="text-2xl font-bold text-[#3D4852] font-[family-name:var(--font-plus-jakarta)]">
              Coming Soon
            </p>
          </div>
        </div>

        <div className="text-sm text-[#6B7280] max-w-md">
          Detailed analytics for visitors, page views, and engagement metrics will be available in
          dedicated pages for each section.
        </div>
      </div>
    </Card>
  );
}
