export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  order: number;
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  icon?: string;
}

export interface AboutData {
  fullName: string;
  tagline: string | null;
  shortBio?: string | null;
  bio: string | null;
  avatarUrl: string | null;
  socialLinks: SocialLink[];
}
