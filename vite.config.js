import { defineConfig } from 'vite';

export default defineConfig({
  base: '/goob-site/', // This sets the base URL for your project in production
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