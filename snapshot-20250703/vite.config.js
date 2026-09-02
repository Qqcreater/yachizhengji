import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5176,
    proxy: {
      '/api-proxy': {
        target: 'https://openapi-lab.ilmsmile.com.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy/, '/openapi'),
      },
      '/serverapi': {
        target: 'https://openapi-lab.ilmsmile.com.cn',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
