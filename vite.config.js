import { defineConfig } from 'vite';

export default defineConfig({
  base: '/goob-site/', // Path based on your repo name
  build: {
    outDir: 'dist', // Explicitly set output directory
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});