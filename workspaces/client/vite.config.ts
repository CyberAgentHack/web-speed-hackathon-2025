import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      assetsDir: 'public',
      outDir: 'dist',
    },
    plugins: [react()],
  };
});
