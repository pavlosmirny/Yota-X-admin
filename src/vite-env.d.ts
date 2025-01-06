/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Добавьте другие переменные окружения здесь, если необходимо
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
