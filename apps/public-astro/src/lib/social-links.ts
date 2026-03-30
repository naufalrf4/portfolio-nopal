import type { SocialLink } from '@/types';

const PUBLIC_SOCIAL_PLATFORMS = new Set([
  'github',
  'linkedin',
  'twitter',
  'x',
  'instagram',
  'youtube',
  'email',
]);

export function isPublicSocialPlatform(platform: string | null | undefined): boolean {
  if (!platform) {
    return false;
  }

  return PUBLIC_SOCIAL_PLATFORMS.has(platform.trim().toLowerCase());
}

export function filterPublicSocialLinks(links: SocialLink[] | null | undefined): SocialLink[] {
  if (!links || links.length === 0) {
    return [];
  }

  return links.filter((link) => isPublicSocialPlatform(link.platform));
}
