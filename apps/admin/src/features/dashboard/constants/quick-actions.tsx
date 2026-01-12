import {
  MessageSquare,
  Mail,
  FolderKanban,
  Link,
  BookOpen,
  Users,
  Calendar,
  User,
  BarChart3,
  FileText,
} from 'lucide-react';
import type { QuickAction } from '../types';

export const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: <FolderKanban className="w-4 h-4" />,
    label: 'Add Project',
    href: '/projects',
    delay: 700,
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: 'Add Blog Link',
    href: '/blogs',
    delay: 750,
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Guestbook',
    href: '/guestbook',
    delay: 800,
  },
  {
    icon: <Mail className="w-4 h-4" />,
    label: 'Messages',
    href: '/messages',
    delay: 850,
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: 'Contacts',
    href: '/contacts',
    delay: 900,
  },
  {
    icon: <Link className="w-4 h-4" />,
    label: 'Profile Links',
    href: '/links',
    delay: 950,
  },
  {
    icon: <Calendar className="w-4 h-4" />,
    label: 'Bookings',
    href: '/bookings',
    delay: 1000,
  },
  {
    icon: <User className="w-4 h-4" />,
    label: 'About Me',
    href: '/about',
    delay: 1050,
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    label: 'Analytics',
    href: '/analytics',
    delay: 1100,
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: 'Knowledge Docs',
    href: '/rag',
    delay: 1150,
  },
];
