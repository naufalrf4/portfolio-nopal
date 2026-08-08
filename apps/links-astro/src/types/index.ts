import type { AboutData as AdminAboutData, ProfileLink } from '@naufalrf/contracts';

export type { ProfileLink } from '@naufalrf/contracts';

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  icon?: string;
}

/**
 * Links-page view model, normalized from the full Admin AboutData contract.
 * The Admin contract includes linkedin through socialLinks[].platform;
 * this local shape keeps the links app's existing reduced view model.
 */
export interface AboutData {
  fullName: string;
  tagline: string | null;
  shortBio?: string | null;
  bio: string | null;
  avatarUrl: string | null;
  socialLinks: SocialLink[];
}

export type AdminAbout = AdminAboutData;
export type AdminProfileLink = ProfileLink;
