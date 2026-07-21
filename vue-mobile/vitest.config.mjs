import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vitest runs outside Quasar CLI (app-webpack).
 * Aliases mirror jsconfig.json so imports like `components/...` and `src/...` resolve.
 */
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'svg-as-url-stub',
      transform (_code, id) {
        if (id.endsWith('.svg')) {
          return {
            code: 'export default "data:image/svg+xml,stub"',
            map: null,
          }
        }
      },
    },
  ],
  define: {
    __QUASAR_VERSION__: JSON.stringify('2.12.7'),
    __QUASAR_SSR__: false,
    __QUASAR_SSR_SERVER__: false,
    __QUASAR_SSR_CLIENT__: false,
    __QUASAR_SSR_PWA__: false,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      // Prefer ESM build; CJS prod breaks under Vitest/jsdom.
      quasar: path.resolve(root, 'node_modules/quasar/dist/quasar.esm.js'),
      src: path.resolve(root, 'src'),
      app: root,
      components: path.resolve(root, 'src/components'),
      layouts: path.resolve(root, 'src/layouts'),
      pages: path.resolve(root, 'src/pages'),
      assets: path.resolve(root, 'src/assets'),
      boot: path.resolve(root, 'src/boot'),
      stores: path.resolve(root, 'src/stores'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/unit/setup.js'],
    include: ['test/unit/**/*.{spec,test}.{js,mjs}'],
    css: false,
    server: {
      deps: {
        inline: ['quasar'],
      },
    },
  },
})
