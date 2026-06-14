import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// Library build only. The dev server + API proxy that used to live here moved
// to examples/basic  those are a *consumer* concern, not the widget's.
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
        'src/test/**',
      ],
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UniswapWidgetReact',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Everything below is provided by the host app (declared as peerDependencies),
      // so it must stay external. Regexes keep subpath imports
      // ('@reown/appkit/react', 'viem/chains', ...) external too.
      // `@uniswap-widget/core` is a regular dependency that ships as its own
      // package, so it stays external rather than being inlined here.
      external: [
        /^@uniswap-widget\//,
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@wagmi\//,
        /^wagmi($|\/)/,
        /^viem($|\/)/,
        /^@reown\/appkit/,
        /^@uniswap\//,
        /^@tanstack\//,
        /^ethers($|\/)/,
        'jsbi',
      ],
      output: {
        preserveModules: false, // required for the UMD build
        globals: {
          '@uniswap-widget/core': 'UniswapWidgetCore',
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsx',
          '@wagmi/core': 'wagmiCore',
          'wagmi': 'wagmi',
          'viem': 'viem',
          '@reown/appkit': 'reownAppkit',
          '@reown/appkit/react': 'reownAppkitReact',
          '@reown/appkit/networks': 'reownAppkitNetworks',
          '@reown/appkit-adapter-wagmi': 'reownAppkitAdapterWagmi',
          '@uniswap/sdk-core': 'uniswapSdkCore',
          '@uniswap/v3-sdk': 'uniswapV3Sdk',
          '@tanstack/react-query': 'reactQuery',
          'ethers': 'ethers',
          'jsbi': 'JSBI',
        },
      },
    },
    copyPublicDir: false,
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
