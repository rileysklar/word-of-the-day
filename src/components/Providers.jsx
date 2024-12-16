import { UploadThingProvider } from "@uploadthing/react";

export function Providers({ children }) {
  return (
    <UploadThingProvider>
      {children}
    </UploadThingProvider>
  );
}
