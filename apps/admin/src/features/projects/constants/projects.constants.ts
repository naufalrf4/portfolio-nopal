export const NEUMORPHIC_STYLES = {
  background: '#E0E5EC',
  foreground: '#3D4852',
  muted: '#6B7280',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  success: '#38B2AC',
  warning: '#F59E0B',
  shadows: {
    extruded: '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
    extrudedSmall: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
    inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
    insetSmall:
      'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
    insetTiny: 'inset 2px 2px 4px rgba(163,177,198,0.4), inset -2px -2px 4px rgba(255,255,255,0.4)',
    small: '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
    button: '8px 8px 16px rgba(163, 177, 198, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.5)',
    hover: '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
    activeInset:
      'inset 6px 6px 12px rgba(163,177,198,0.4), inset -6px -6px 12px rgba(255,255,255,0.4)',
    viewToggleActive: '6px 6px 12px rgba(59,130,246,0.4), -6px -6px 12px rgba(59,130,246,0.1)',
    viewToggleInactive: '6px 6px 12px rgba(163,177,198,0.4), -6px -6px 12px rgba(255,255,255,0.4)',
  },
};

export const FILTER_BUTTON_STYLES = {
  active: `bg-[${NEUMORPHIC_STYLES.accent}] text-white shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(59,130,246,0.1)]`,
  inactive: `bg-[${NEUMORPHIC_STYLES.background}] text-[${NEUMORPHIC_STYLES.foreground}] shadow-[6px_6px_12px_rgba(163,177,198,0.4),-6px_-6px_12px_rgba(255,255,255,0.4)] hover:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.4),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]`,
};
