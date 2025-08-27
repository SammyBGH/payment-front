import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // default, can change if needed
    sourcemap: false // optional, disables source maps for production
  }
})
