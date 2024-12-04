import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
// import compress from "astro-compress";
import vercelStatic from '@astrojs/vercel/static';

import sitemap from "@astrojs/sitemap";

import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://pablodev.cl',
  integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false}), react()],
  output: 'static',
  adapter: vercelStatic({
    analytics: true
  })
});