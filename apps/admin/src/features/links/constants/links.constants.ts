import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Link2,
  type LucideIcon,
} from 'lucide-react';

export const NEUMORPHIC_STYLES = {
  background: '#E0E5EC',
  foreground: '#3D4852',
  muted: '#6B7280',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  success: '#38B2AC',
  shadows: {
    extruded: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
    inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
    insetDeep:
      'inset 10px 10px 20px rgba(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)',
    small: '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
  },
};

export const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon; color: string }[] = [
  { value: 'github', label: 'GitHub', icon: Github, color: '#333333' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { value: 'mail', label: 'Email', icon: Mail, color: '#EA4335' },
  { value: 'globe', label: 'Website', icon: Globe, color: '#3B82F6' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000' },
];

export const INITIAL_FORM_DATA = {
  label: '',
  url: '',
  icon: '',
};

export const DEFAULT_ICON = { icon: Link2, color: '#3B82F6' };
