import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const siteUrl = import.meta.env.SITE_URL || 'https://naufalrf.tech';
  return new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap-index.xml`].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
};
