import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    {
      name: 'modify-plugin-json',
      apply: 'build',
      async closeBundle() {
        // 读取 public/plugin.json
        const srcPath = path.resolve(__dirname, 'public/plugin.json')
        const distPath = path.resolve(__dirname, 'dist/plugin.json')
        try {
          let content = await readFile(srcPath, 'utf-8')
          let json = JSON.parse(content)
          // 在这里对 json 做你想要的修改
          delete json.development
          // 写入到 dist 目录
          await writeFile(distPath, JSON.stringify(json, null, 2), 'utf-8')
        } catch (e) {
          console.error('处理 plugin.json 失败:', e)
        }
      },
    },
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
