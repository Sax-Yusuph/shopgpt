import { getFonts, getManifest } from '@bedframe/core'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import {
  fonts,
  manifest as manifests,
  pages,
  tests,
} from './src/_config/bedframe.config'

export default defineConfig(({ command, mode }) => {
  return {
    root: resolve(__dirname, './src'),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      getManifest({ command, mode }, manifests),
      getFonts(fonts),
      react(),
      macrosPlugin(),
    ],
    build: {
      outDir: resolve(__dirname, 'dist', mode),
      emptyOutDir: true,
      rollupOptions: {
        input: pages,
      },
    },
    server: {
      hmr: {
        port: 5173,
      },
      port: 5173,
      strictPort: true,
    },
    test: tests,
  }
})
