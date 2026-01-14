import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://naufalrf.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/projects', '/blogs', '/guestbook', '/contact', '/ai-chatbot'].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : route.includes('blog') ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : route === '/about' ? 0.9 : 0.8,
    })
  );

  return routes as MetadataRoute.Sitemap;
}
