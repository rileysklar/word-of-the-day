// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
  integrations: [tailwind(), react()],
  output: "server",
  adapter: netlify({
    edgeMiddleware: true
  }),
  vite: {
    define: {
      'process.env.UPLOADTHING_TOKEN': JSON.stringify(process.env.UPLOADTHING_TOKEN)
    },
    optimizeDeps: {
      exclude: ["@uploadthing/react"]
    },
  }
});
