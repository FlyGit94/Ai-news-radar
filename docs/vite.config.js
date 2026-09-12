import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 必须写仓库名，前后都有斜杠
  base: '/AI-news-radar/', 
})
