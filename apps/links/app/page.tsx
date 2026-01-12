import { ProfileHeader } from '../src/components/ProfileHeader';
import { SocialIcons } from '../src/components/SocialIcons';
import { LinkButtons } from '../src/components/LinkButtons';

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
    <main className="w-full max-w-md mx-auto">
      <div className="neu-card flex flex-col items-center gap-6">
        <ProfileHeader
          name={aboutData?.fullName || 'NaufalRF'}
          bio={aboutData?.tagline || 'Full-Stack Engineer'}
          avatarUrl={aboutData?.avatarUrl}
        />

        {socialLinks.length > 0 && <SocialIcons links={socialLinks} />}

        {websiteLinks.length > 0 && <LinkButtons links={websiteLinks} />}

        <footer className="mt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NaufalRF</p>
        </footer>
      </div>
    </main>
  );
}
