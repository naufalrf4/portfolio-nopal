import { Eye, EyeOff, Star } from 'lucide-react';
import type { FilterMode } from '../types';

export const FILTER_BUTTONS = [
  { mode: 'all' as FilterMode, label: 'All', icon: null },
  { mode: 'visible' as FilterMode, label: 'Visible', icon: Eye },
  { mode: 'hidden' as FilterMode, label: 'Hidden', icon: EyeOff },
  { mode: 'featured' as FilterMode, label: 'Featured', icon: Star },
] as const;

export const NEUMORPHIC_STYLES = {
  card: {
    boxShadow: '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
  },
  iconContainer: {
    boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.5)',
  },
  techBadge: {
    boxShadow: 'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
  },
  techBadgeSmall: {
    boxShadow: 'inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.4)',
  },
} as const;
