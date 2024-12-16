import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "../../server/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});
