import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const api = `http://localhost:${env.PORT || 3051}`;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Em desenvolvimento, a API roda separada (npm run server)
    server: {
      proxy: {
        '/api': api,
        '/files': api,
      },
    },
  };
});
