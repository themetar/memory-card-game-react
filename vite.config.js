import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    include: /\.js$/,
    exclude: [],
    loader: 'jsx',
  },
})
