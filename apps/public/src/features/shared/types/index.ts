export type {
  AboutData,
  BlogLink,
  BookingData,
  BookingSlot,
  ContactFormData,
  GuestbookEntry,
  ProfileLink,
  Project,
  ProjectContext,
  ProjectImage,
} from '@/src/lib/api/types';

export interface Experience {
  id: string;
  type: 'work' | 'education' | 'certification' | 'organization';
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  skills?: string[];
}

export interface Skill {
  name: string;
  category: string;
  level?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}
