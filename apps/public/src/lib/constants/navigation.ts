import {
  Home,
  User,
  FolderKanban,
  FileText,
  Mail,
  MoreHorizontal,
  FlaskConical,
  MessageCircleQuestion,
  Link2,
  Bot,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/blogs', label: 'Blogs', icon: FileText },
  { href: '/contact', label: 'Contact', icon: Mail },
] as const;

export const OTHER_LINKS = [
  { href: '/ai-chatbot', label: 'AI Assistant', icon: Bot, external: false },
  { href: 'https://labs.naufalrf.tech', label: 'Labs', icon: FlaskConical, external: true },
  { href: 'https://ngl.naufalrf.tech', label: 'NGL', icon: MessageCircleQuestion, external: true },
  { href: 'https://links.naufalrf.tech', label: 'Links', icon: Link2, external: true },
] as const;

export const MOBILE_NAV_ITEMS = [
  ...NAV_ITEMS,
  { href: '#other', label: 'Other', icon: MoreHorizontal },
] as const;
