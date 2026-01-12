export const NEUMORPHIC_STYLES = {
  background: '#E0E5EC',
  foreground: '#3D4852',
  muted: '#6B7280',
  accent: '#3B82F6',
  accentLight: '#38B2AC',
  success: '#38B2AC',
  shadows: {
    extruded: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
    inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
    insetDeep:
      'inset 10px 10px 20px rgba(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)',
    small: '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
  },
};

export const FILTER_BUTTONS = [
  { key: 'all' as const, label: 'All' },
  { key: 'visible' as const, label: 'Visible' },
  { key: 'hidden' as const, label: 'Hidden' },
];

export const SKELETON_COUNT = 6;
