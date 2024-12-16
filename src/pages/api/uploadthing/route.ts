import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./core";

// Export routes for API
export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID || "",
    uploadthingSecret: process.env.UPLOADTHING_SECRET || "",
    isDev: true
  }
});
