import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` -> dist/ multi-file build, for deploying to Firebase Hosting.
// `npm run build:preview` -> dist-preview/index.html, a single self-contained
// file with no external JS/CSS requests, so it can be opened by double-click
// (Chrome blocks separate module scripts under file:// with a CORS error).
export default defineConfig(({ mode }) => {
  const isPreview = mode === 'singlefile'
  return {
    base: './',
    plugins: [react(), ...(isPreview ? [viteSingleFile()] : [])],
    build: {
      outDir: isPreview ? 'dist-preview' : 'dist',
    },
  }
})
