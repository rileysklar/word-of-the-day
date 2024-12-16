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
    optimizeDeps: {
      exclude: ["@uploadthing/react"]
    },
  },
  // Make environment variables available to client
  publicEnv: {
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN
  }
});
