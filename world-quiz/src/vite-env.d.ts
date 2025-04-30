interface ImportMetaEnv {
  readonly VITE_GEO_SERVICE_URL: string;
  readonly VITE_QUIZ_SERVICE_URL: string;
  readonly VITE_AUTH_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
