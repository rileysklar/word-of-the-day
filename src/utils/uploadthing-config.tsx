import React from "react";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { generateReactHelpers, generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "../pages/api/uploadthing/core";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "user" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { useUploadThing } = generateReactHelpers({
  url: "/api/uploadthing"
});

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

interface UploadButtonProps {
  onClientUploadComplete: (res?: { uploadedBy: string; url: string }[]) => void;
  onUploadError: (error: Error) => void;
}

export const CustomUploadButton: React.FC<UploadButtonProps> = ({ onClientUploadComplete, onUploadError }) => {
  return (
    <UploadDropzone<OurFileRouter>
      endpoint="imageUploader"
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    />
  );
};
