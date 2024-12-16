import type { APIRoute } from "astro";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./core";
import { uploadthingConfig } from "../../../utils/uploadthing-config";

export const config = {
  runtime: 'edge'
};

const handler = createRouteHandler({
  router: uploadRouter,
  config: uploadthingConfig,
});

export const GET: APIRoute = async ({ request }) => {
  return await handler.GET(request);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Processing upload request');
    console.log('Environment variables present:', {
      hasAppId: !!uploadthingConfig.uploadthingId,
      hasSecret: !!uploadthingConfig.uploadthingSecret,
      hasToken: !!uploadthingConfig.uploadthingToken
    });
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
