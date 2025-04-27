import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), './src'),
      '@assets': resolve(process.cwd(), './src/assets'),
      '@utils': resolve(process.cwd(), './src/utils'),
      '@components': resolve(process.cwd(), './src/components'),
      '@api': resolve(process.cwd(), './src/api'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
});
