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
        try {
          // 读取 public/plugin.json
          const srcPath = path.resolve(__dirname, 'public/plugin.json')
          const distPath = path.resolve(__dirname, 'dist/plugin.json')
          let content = await readFile(srcPath, 'utf-8')
          let json = JSON.parse(content)
          // 在这里对 json 做你想要的修改
          delete json.development
          // 写入到 dist 目录
          await writeFile(distPath, JSON.stringify(json, null, 2), 'utf-8')

          // 复制 README.md 到 dist 目录
          const readmeSrcPath = path.resolve(__dirname, 'README.md')
          const readmeDistPath = path.resolve(__dirname, 'dist/README.md')
          const readmeContent = await readFile(readmeSrcPath, 'utf-8')
          await writeFile(readmeDistPath, readmeContent, 'utf-8')
          console.log('README.md 已复制到 dist 目录')
        } catch (e) {
          console.error('处理文件失败:', e)
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
