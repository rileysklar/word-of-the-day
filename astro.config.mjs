// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: netlify(),
  vite: {
    define: {
      'import.meta.env.UPLOADTHING_APP_ID': JSON.stringify(process.env.UPLOADTHING_APP_ID),
      'import.meta.env.UPLOADTHING_SECRET': JSON.stringify(process.env.UPLOADTHING_SECRET),
      'import.meta.env.UPLOADTHING_TOKEN': JSON.stringify(process.env.UPLOADTHING_TOKEN),
    },
    optimizeDeps: {
      exclude: ["@uploadthing/react"]
    },
  }
});
