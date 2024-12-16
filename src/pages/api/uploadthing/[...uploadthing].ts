import type { APIRoute } from "astro";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./core";

export const config = {
  runtime: 'edge'
};

const handler = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingId: import.meta.env.UPLOADTHING_APP_ID,
    uploadthingSecret: import.meta.env.UPLOADTHING_SECRET,
    uploadthingToken: import.meta.env.UPLOADTHING_TOKEN,
    isDev: import.meta.env.DEV,
  },
});

export const GET: APIRoute = async ({ request }) => {
  return await handler.GET(request);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Processing upload request');
    console.log('Token present:', !!import.meta.env.UPLOADTHING_TOKEN);
    const response = await handler.POST(request);
    console.log('Upload response:', response);
    return response;
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
