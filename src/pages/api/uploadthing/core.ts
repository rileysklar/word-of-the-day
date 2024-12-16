import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "user" });

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      try {
        console.log("UploadThing middleware executing");
        return { userId: "user" };
      } catch (error) {
        console.error("UploadThing middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete for file:", file);
        console.log("With metadata:", metadata);
        return { url: file.url };
      } catch (error) {
        console.error("Upload complete error:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
