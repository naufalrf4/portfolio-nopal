import type { APIRoute } from 'astro';
import { getSiteUrl } from '../lib/site';

export const GET: APIRoute = () => {
  const siteUrl = getSiteUrl();
  const aiCrawlers = [
    'GPTBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Google-Extended',
    'ClaudeBot',
    'anthropic-ai',
    'CCBot',
  ];
  const aiCrawlerRules = aiCrawlers.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']);
  return new Response(
    ['User-agent: *', 'Allow: /', '', ...aiCrawlerRules, `Sitemap: ${siteUrl}/sitemap-index.xml`].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
};
