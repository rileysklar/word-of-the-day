/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly AWS_ACCESS_KEY_ID: string;
  readonly AWS_SECRET_ACCESS_KEY: string;
  readonly AWS_REGION: string;
  readonly AWS_S3_BUCKET: string;
  readonly PUBLIC_AWS_REGION: string;
  readonly PUBLIC_AWS_S3_BUCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
