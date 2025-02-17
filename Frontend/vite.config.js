import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split libraries like React into separate chunks
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/');
            const name = parts[parts.length - 1].split('/')[0]; // Extract the first package name
            return name; // This creates a chunk per package (e.g., react.js, lodash.js)
          }
        },
      },
    },
  },
});
