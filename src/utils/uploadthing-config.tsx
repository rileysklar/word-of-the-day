import React from "react";
import { generateReactHelpers } from "@uploadthing/react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "../pages/api/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url: "http://localhost:4321/api/uploadthing"
});

interface UploadButtonProps {
  onClientUploadComplete: (res?: { uploadedBy: string; url: string }[]) => void;
  onUploadError: (error: Error) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onClientUploadComplete, onUploadError }) => {
  return (
    <UploadDropzone<OurFileRouter>
      endpoint="wordImage"
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    />
  );
};
