import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Vue 3 component-library build. SFCs are compiled by @vitejs/plugin-vue; types
// are emitted separately by vue-tsc (see the `build` script). The web3/uniswap
// stack and the core stay external  provided by the host app.
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // AppKit's web components (<appkit-account-button>, ...) are custom
          // elements, not Vue components.
          isCustomElement: (tag) => tag.startsWith('appkit-'),
        },
      },
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UniswapWidgetVue',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        /^@uniswap-widget\//,
        /^vue($|\/)/,
        /^@wagmi\//,
        /^viem($|\/)/,
        /^@reown\/appkit/,
        /^@uniswap\//,
        /^ethers($|\/)/,
        'jsbi',
      ],
      output: {
        preserveModules: false, // required for the UMD build
        globals: {
          vue: 'Vue',
          '@uniswap-widget/core': 'UniswapWidgetCore',
          '@wagmi/core': 'wagmiCore',
          viem: 'viem',
          '@reown/appkit': 'reownAppkit',
          '@reown/appkit-adapter-wagmi': 'reownAppkitAdapterWagmi',
          ethers: 'ethers',
          jsbi: 'JSBI',
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
