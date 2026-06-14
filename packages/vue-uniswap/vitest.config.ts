import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Component + composable tests run in jsdom. Kept separate from vite.config.ts
// so the lib-build settings don't apply during tests.
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('appkit-'),
        },
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.spec.ts'],
  },
})
