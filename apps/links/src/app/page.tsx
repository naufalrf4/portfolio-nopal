import { ProfileHeader } from '../components/ProfileHeader';
import { SocialIcons } from '../components/SocialIcons';
import { LinkButtons } from '../components/LinkButtons';

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

async function getAboutData(): Promise<AboutData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/v1/public/about`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const json = await response.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

async function getLinks(): Promise<ProfileLink[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/v1/public/links`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const json = await response.json();
    return json.data ?? json ?? [];
  } catch {
    return [];
  }
}

const SOCIAL_PLATFORMS = ['github', 'linkedin', 'twitter', 'instagram', 'youtube', 'email'];

function isSocialLink(link: ProfileLink): boolean {
  const iconLower = link.icon?.toLowerCase() || '';
  const labelLower = link.label.toLowerCase();
  return SOCIAL_PLATFORMS.some(
    (platform) => iconLower.includes(platform) || labelLower.includes(platform)
  );
}

export default async function LinksPage() {
  const [aboutData, links] = await Promise.all([getAboutData(), getLinks()]);

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
