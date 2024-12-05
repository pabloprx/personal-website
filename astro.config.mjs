import { defineConfig, envField } from "astro/config";
import mdx from "@astrojs/mdx";
// import compress from "astro-compress";
import vercelStatic from "@astrojs/vercel/static";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://pablodev.cl",
  integrations: [
    mdx(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  output: "server",
  adapter: vercelStatic({
    analytics: true,
  }),
  env: {
    schema: {
      R2_BUCKET_NAME: envField.string({
        context: "server",
        access: "public",
        required: true,
      }),
      R2_ACCOUNT_ID: envField.string({
        context: "server",
        access: "public",
        required: true,
      }),
      R2_ACCESS_KEY_ID: envField.string({
        context: "server",
        access: "public",
        required: true,
      }),
      R2_SECRET_ACCESS_KEY: envField.string({
        context: "server",
        access: "public",
        required: true,
      }),
    },
  },
  redirects: {
    "/": "/contacto",
  },
});
