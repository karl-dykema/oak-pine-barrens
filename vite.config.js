import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/oak-pine-barrens/',
  plugins: [react()],
  assetsInclude: ['**/*.md'],
})
