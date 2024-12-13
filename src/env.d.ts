/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ACCESS: string;
  readonly SECRET: string;
  readonly REGION: string;
  readonly AWS_S3_BUCKET: string;
  readonly PUBLIC_REGION: string;
  readonly PUBLIC_AWS_S3_BUCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
