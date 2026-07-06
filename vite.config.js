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
      // 统一代理：所有 /openapi/** 请求转发到 openapi-lab
      // 前缀保留：endpoint 直接以 /openapi/... 开头即可
      // 无 rewrite：避免多次迭代后路径拼写错误
      '/openapi': {
        target: 'https://openapi-lab.ilmsmile.com.cn',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
