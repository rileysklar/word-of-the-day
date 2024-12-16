import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { OurFileRouter } from "../pages/api/uploadthing/core";
import { uploadthingConfig } from "./uploadthing-config";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  config: uploadthingConfig
});
