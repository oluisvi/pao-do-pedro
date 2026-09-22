import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

function preserveExistingStaticAssets() {
  return {
    name: 'preserve-existing-static-assets',
    closeBundle() {
      const out = resolve('dist');
      mkdirSync(resolve(out, 'assets'), { recursive: true });
      cpSync(resolve('assets/brand'), resolve(out, 'assets/brand'), { recursive: true });
      cpSync(resolve('assets/images'), resolve(out, 'assets/images'), { recursive: true });
      copyFileSync(resolve('site.webmanifest'), resolve(out, 'site.webmanifest'));
    }
  };
}

export default defineConfig({
  plugins: [react(), preserveExistingStaticAssets()],
  build: {
    target: 'es2020'
  }
});
