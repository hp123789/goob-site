import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // This sets the base URL for your project in production
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});