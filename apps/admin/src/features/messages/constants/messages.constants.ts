import type { FilterTab } from '../types/messages.types';

export const NEUMORPHIC_SHADOWS = {
  extruded: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
  inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
  extrudedSm: '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
  insetSm: 'inset 4px 4px 6px rgba(163,177,198,0.6), inset -4px -4px 6px rgba(255,255,255,0.5)',
};

export const COLORS = {
  background: '#E0E5EC',
  foreground: '#3D4852',
  muted: '#6B7280',
  accent: '#3B82F6',
  amber: '#F59E0B',
};

export const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];
