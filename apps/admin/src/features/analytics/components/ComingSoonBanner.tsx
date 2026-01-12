'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock } from 'lucide-react';
import { NEUMORPHIC_SHADOWS } from '../constants';

export function ComingSoonBanner() {
  return (
    <Card
      className="p-8 mb-8 relative overflow-hidden"
      style={{
        boxShadow: NEUMORPHIC_SHADOWS.extruded,
        background: 'linear-gradient(135deg, #E0E5EC 0%, #EFF2F7 100%)',
      }}
    >
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                boxShadow:
                  '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
              }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#3D4852] mb-2">
                Analytics Dashboard Coming Soon
              </h2>
              <p className="text-[#6B7280]">
                We're working on bringing you powerful insights and analytics
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3B82F6',
              borderColor: '#3B82F6',
            }}
          >
            <Clock className="h-4 w-4" />
            In Development
          </Badge>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <Sparkles className="w-full h-full text-[#3B82F6]" />
      </div>
    </Card>
  );
}
