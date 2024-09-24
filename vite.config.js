import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
// import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // visualizer({ open: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
