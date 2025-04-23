import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes("@turf")) return "vendor-turf";
            if (id.includes("mapbox")) return "vendor-mapbox";
            if (id.includes("react")) return "vendor-react";
            return "vendor";
          }
        }
      }
    }
  }
})
