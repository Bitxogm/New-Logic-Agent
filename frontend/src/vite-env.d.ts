/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Añade más variables aquí si las necesitas
  // readonly VITE_OTRA_VAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}