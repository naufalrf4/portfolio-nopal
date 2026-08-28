import type { APIRoute } from 'astro';
import { getProjects } from '../lib/api';
import { getSiteUrl } from '../lib/site';

const STATIC_ROUTES = [
  '',
  '/about',
  '/projects',
  '/publications',
  '/services',
  '/contact',
  '/ai-chatbot',
  '/guestbook',
  '/portfolio',
];

function createSitemapEntry(url: string, changefreq: string, priority: string): string {
  return `<url><loc>${url}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export const GET: APIRoute = async () => {
  const siteUrl = getSiteUrl();
  // Sitemap generation should degrade gracefully rather than 500 the whole
  // route when the projects API is unreachable: fall back to static routes
  // only so search engines still get a valid sitemap.
  let projects: Awaited<ReturnType<typeof getProjects>>['projects'] = [];
  try {
    projects = (await getProjects()).projects;
  } catch {
    projects = [];
  }

  const staticEntries = STATIC_ROUTES.map((route, index) =>
    createSitemapEntry(
      `${siteUrl}${route}`,
      index === 0 ? 'weekly' : 'monthly',
      index === 0 ? '1.0' : '0.8'
    )
  );

  const projectEntries = projects.map((project) =>
    createSitemapEntry(`${siteUrl}/projects/${project.slug}`, 'monthly', '0.7')
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...projectEntries].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
