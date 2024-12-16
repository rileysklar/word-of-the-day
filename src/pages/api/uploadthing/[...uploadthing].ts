import { createNextRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./core";

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // this is for US East (N. Virginia)
};

const handler = createNextRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
    isDev: process.env.NODE_ENV === 'development',
  },
});

export const GET = handler.GET;
export const POST = handler.POST;
