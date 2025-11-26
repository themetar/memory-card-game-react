import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
// for html generation with plugin-html
import { CARDS_BASE } from './src/game/data'

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          cardsImageSources: CARDS_BASE.map(({contents: {src}}) => src)
        }
      }
    })
  ],
  esbuild: {
    include: /\.js$/,
    exclude: [],
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './test/setupTests.js',
  },
})
