import { LinksPageContent } from '../components/LinksPageContent';

export const dynamic = 'force-dynamic';

async function getLinksData() {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  try {
    const [aboutResponse, linksResponse] = await Promise.all([
      fetch(`${baseUrl}/api/v1/public/about`, {
        next: { revalidate: 7200 },
      }),
      fetch(`${baseUrl}/api/v1/public/links`, {
        next: { revalidate: 7200 },
      }),
    ]);

    if (!aboutResponse.ok || !linksResponse.ok) {
      console.error('Failed to fetch data:', aboutResponse.status, linksResponse.status);
      return null;
    }

    const aboutJson = await aboutResponse.json();
    const linksJson = await linksResponse.json();

    return {
      aboutData: aboutJson.data ?? aboutJson,
      links: linksJson.data ?? linksJson ?? [],
    };
  } catch (error) {
    console.error('Error fetching links data:', error);
    return null;
  }
}

export default async function LinksPage() {
  const data = await getLinksData();

  const fallbackData = {
    aboutData: {
      fullName: 'NaufalRF',
      tagline: 'Full-Stack Engineer',
      bio: '',
      avatarUrl: '',
      socialLinks: [],
    },
    links: [],
  };

  return <LinksPageContent initialData={data || fallbackData} />;
}
