'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Folder, Mail, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { NEUMORPHIC_SHADOWS } from '../constants';
import type { PlaceholderCardProps } from '../types';

const iconMap = {
  eye: Eye,
  folder: Folder,
  mail: Mail,
  messageSquare: MessageSquare,
  calendar: Calendar,
  trendingUp: TrendingUp,
};

export function PlaceholderCard({ title, description, icon }: PlaceholderCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap];

  return (
    <Card
      className="p-6 relative overflow-hidden"
      style={{
        boxShadow: NEUMORPHIC_SHADOWS.extruded,
        backgroundColor: '#E0E5EC',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
            boxShadow: '3px 3px 6px rgba(163,177,198,0.6), -3px -3px 6px rgba(255,255,255,0.5)',
          }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <Badge
          variant="outline"
          className="text-xs"
          style={{
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            color: '#6B7280',
          }}
        >
          Coming Soon
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-[#3D4852] mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280]">{description}</p>

      <div className="mt-6 space-y-2">
        <div
          className="h-2 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #D1D5DB 0%, #E5E7EB 100%)',
          }}
        />
        <div
          className="h-2 rounded-full w-3/4"
          style={{
            background: 'linear-gradient(90deg, #D1D5DB 0%, #E5E7EB 100%)',
          }}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5">
        <Icon className="w-full h-full" />
      </div>
    </Card>
  );
}
