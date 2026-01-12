export const NEUMORPHIC_SHADOWS = {
  extruded: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
  inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255, 0.5)',
  extrudedSm: '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5)',
};

export const ANALYTICS_CARDS = [
  {
    title: 'Total Views',
    description: 'Track page views and visitor analytics',
    icon: 'eye',
  },
  {
    title: 'Project Views',
    description: 'Monitor individual project engagement',
    icon: 'folder',
  },
  {
    title: 'Contact Forms',
    description: 'Analyze contact form submissions',
    icon: 'mail',
  },
  {
    title: 'Guestbook Activity',
    description: 'View guestbook entry statistics',
    icon: 'messageSquare',
  },
  {
    title: 'Booking Metrics',
    description: 'Track booking conversion rates',
    icon: 'calendar',
  },
  {
    title: 'Traffic Sources',
    description: 'Understand where your visitors come from',
    icon: 'trendingUp',
  },
] as const;
