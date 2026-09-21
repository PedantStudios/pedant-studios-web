// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://pedantstudios.com',
  output: 'static',
  adapter: vercel(),
  redirects: {
    // Product renamed WebCenter → Pedant Clok (2026-07-05); preserve old URL's SEO.
    '/webcenter': { status: 301, destination: '/clok' },
  },
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
