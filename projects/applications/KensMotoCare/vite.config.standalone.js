// Builds the app as ONE self-contained HTML file (dist-standalone/index.html)
// that opens directly from file:// — no dev server required.
// Usage: npm run build:standalone
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-standalone'
  }
});
