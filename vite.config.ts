import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      // data/ 是后端（server.js）的 JSON 持久化目录，必须排除监视，
      // 否则每次写文件都会触发 Vite 整页重载（曾导致报名向导被重置）。
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : { ignored: ['**/data/**', '**/node_modules/**', '**/scripts/**'] },
      // 简单后端（server.js, :3001）——公众号同步与扫码签到接口
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
  };
});
