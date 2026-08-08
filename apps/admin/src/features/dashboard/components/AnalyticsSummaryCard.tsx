'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Globe2, TrendingUp, MousePointerClick } from 'lucide-react';
import { NEU_INSET_SHADOW } from '../constants';

type AnalyticsSummary = {
  overview: {
    totalSubmissions: number;
    totalClicks: number;
    uniqueCountries: number;
  };
};

export function AnalyticsSummaryCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      setLoading(true);
      try {
        const response = await fetch('/api/v1/admin/analytics?range=30d', {
          signal: controller.signal,
        });
        const payload = await response.json();
        if (payload.success) {
          setData(payload.data);
        }
      } catch {
        // Ignore dashboard summary fetch failures here.
      } finally {
        setLoading(false);
      }
    }

    loadSummary();

    return () => controller.abort();
  }, []);

  const summaryCards = [
    {
      label: 'Submissions',
      value: data?.overview.totalSubmissions ?? 0,
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      label: 'Tracked Clicks',
      value: data?.overview.totalClicks ?? 0,
      icon: MousePointerClick,
      color: 'text-emerald-500',
    },
    {
      label: 'Countries',
      value: data?.overview.uniqueCountries ?? 0,
      icon: Globe2,
      color: 'text-violet-500',
    },
  ];

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
            <p className="text-sm font-medium text-[var(--text-secondary)]">Analytics Overview</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-plus-jakarta)]">
              {loading ? 'Loading…' : 'Live data'}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {summaryCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl bg-white/60 px-4 py-3 shadow-neu-extruded"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <p className="mt-2 text-xl font-bold text-[var(--text-primary)]">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
