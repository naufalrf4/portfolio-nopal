import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), sitemap()],
  site: process.env.SITE_URL || 'https://naufalrf.tech',

  server: { port: 3000 },
});
