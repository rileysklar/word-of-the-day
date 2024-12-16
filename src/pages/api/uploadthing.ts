import type { APIRoute } from "astro";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "../../server/uploadthing";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "user" });

const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file);
      return { url: file.url };
    })
} satisfies FileRouter;

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});

export const POST: APIRoute = handlers;
export const GET: APIRoute = handlers;
