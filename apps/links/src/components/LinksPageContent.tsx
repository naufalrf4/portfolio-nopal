'use client';

import { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { SocialIcons } from './SocialIcons';
import { LinkButtons } from './LinkButtons';
import { ErrorState } from './ErrorState';

interface AboutData {
  fullName: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  socialLinks: { platform: string; url: string }[];
}

interface ProfileLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface LinksPageContentProps {
  initialData: {
    aboutData: AboutData;
    links: ProfileLink[];
  };
}

const SOCIAL_PLATFORMS = ['github', 'linkedin', 'twitter', 'instagram', 'youtube', 'email'];

function isSocialLink(link: ProfileLink): boolean {
  const iconLower = link.icon?.toLowerCase() || '';
  const labelLower = link.label.toLowerCase();
  return SOCIAL_PLATFORMS.some(
    (platform) => iconLower.includes(platform) || labelLower.includes(platform)
  );
}

export function LinksPageContent({ initialData }: LinksPageContentProps) {
  const [error, setError] = useState<string | null>(null);
  const { aboutData, links } = initialData;

  const loadData = async () => {
    try {
      setError(null);
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load links. Please try again later.'
      );
    }
  };

  if (error) {
    return <ErrorState title="Failed to load links" message={error} onRetry={loadData} />;
  }

  const socialLinks = links.filter(isSocialLink);
  const websiteLinks = links.filter((link) => !isSocialLink(link));

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto flex flex-col items-center">
      <div className="opacity-0 animate-scale-in w-full">
        <ProfileHeader
          name={aboutData?.fullName || 'NaufalRF'}
          bio={aboutData?.tagline || 'Full-Stack Engineer'}
          avatarUrl={aboutData?.avatarUrl}
        />
      </div>

      {socialLinks.length > 0 && (
        <div className="opacity-0 animate-fade-in-up stagger-2 w-full flex justify-center mt-2">
          <SocialIcons links={socialLinks} />
        </div>
      )}

      {websiteLinks.length > 0 && (
        <div className="opacity-0 animate-fade-in-up stagger-3 w-full mt-8">
          <LinkButtons links={websiteLinks} />
        </div>
      )}

      <footer className="opacity-0 animate-fade-in-up stagger-5 pt-12 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Naufal Rizqullah Firdaus.
        </p>
      </footer>
    </div>
  );
}
