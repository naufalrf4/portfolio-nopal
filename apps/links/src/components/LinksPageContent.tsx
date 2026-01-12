'use client';

import { useEffect, useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { SocialIcons } from './SocialIcons';
import { LinkButtons } from './LinkButtons';
import { ErrorState } from './ErrorState';
import { ProfileHeaderSkeleton, LinkButtonsSkeleton, SocialIconsSkeleton } from './LoadingSkeleton';

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

const SOCIAL_PLATFORMS = ['github', 'linkedin', 'twitter', 'instagram', 'youtube', 'email'];

function isSocialLink(link: ProfileLink): boolean {
  const iconLower = link.icon?.toLowerCase() || '';
  const labelLower = link.label.toLowerCase();
  return SOCIAL_PLATFORMS.some(
    (platform) => iconLower.includes(platform) || labelLower.includes(platform)
  );
}

async function fetchData() {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  const [aboutResponse, linksResponse] = await Promise.all([
    fetch(`${baseUrl}/api/v1/public/about`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/v1/public/links`, { cache: 'no-store' }),
  ]);

  if (!aboutResponse.ok || !linksResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const aboutJson = await aboutResponse.json();
  const linksJson = await linksResponse.json();

  return {
    aboutData: aboutJson.data ?? aboutJson,
    links: linksJson.data ?? linksJson ?? [],
  };
}

export function LinksPageContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData();
      setAboutData(data.aboutData);
      setLinks(data.links);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load links. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="opacity-0 animate-scale-in w-full">
          <ProfileHeaderSkeleton />
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-2 w-full flex justify-center mt-2">
          <SocialIconsSkeleton count={4} />
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-3 w-full mt-8">
          <LinkButtonsSkeleton count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load links" message={error} onRetry={loadData} />;
  }

  const socialLinks = links.filter(isSocialLink);
  const websiteLinks = links.filter((link) => !isSocialLink(link));

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
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
