import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import path from 'path';

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig({
  plugins: [
    /// @ts-ignore
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
});
