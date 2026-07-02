# Getting started

This page gets a widget rendering quickly. For the full provider configuration, every prop, and the
host-app requirements, head to the package pages — [React](/packages/react) and [Vue](/packages/vue).

## Prerequisites

The widget expects a host app that satisfies a small contract (covered in full on the
[React package page](/packages/react#host-app-requirements)):

- A **Vite** app (configuration is read from `import.meta.env.VITE_*`).
- **Tailwind CSS** set up, with the widget package added to your `content` globs (it ships no CSS).
- An **API proxy** for `/api/base-rpc` (and, if you enable token search, the Uniswap search path).
- A **WalletConnect / Reown Project ID** if you use the default Reown wallet adapter — grab one at
  [cloud.reown.com](https://cloud.reown.com/). (Not needed for the injected-wallet adapter below.)

::: tip The example apps do all of this for you
[`examples/basic`](https://github.com/houtanrocky/uniswap-widget/tree/main/examples/basic) (React)
and [`examples/vue`](https://github.com/houtanrocky/uniswap-widget/tree/main/examples/vue) (Vue) are
ready-made reference hosts. See the [Playground](/playground/) to run them.
:::

## React

### 1. Install

::: code-group
```bash [pnpm]
pnpm add @uniswap-widget/react ethers \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
```
```bash [npm]
npm install @uniswap-widget/react ethers \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
```
```bash [yarn]
yarn add @uniswap-widget/react ethers \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
```
:::

If you use the default Reown wallet, also install its optional peers:
`@reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query`.

### 2. Render the widget

The quickest path uses the built-in **injected-wallet** adapter (MetaMask, Rabby, … via
`window.ethereum`) — no Reown or wagmi required:

```tsx
import {
  SwapWidget,
  WalletAdapterProvider,
  useInjectedWalletAdapter,
} from '@uniswap-widget/react';

export default function App() {
  return (
    <WalletAdapterProvider adapter={useInjectedWalletAdapter}>
      <SwapWidget
        poolConfig={{
          tokenIn:  { chainId: 8453, address: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b', decimals: 18, symbol: 'VIRTUAL', name: 'Virtual Protocol' },
          tokenOut: { chainId: 8453, address: '0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1', decimals: 18, symbol: 'SOLACE',  name: 'Solace by Virtuals' },
          poolAddress: '0x912567c105A172777e56411DD0AA4Acc10e628a9',
          version: 'V2',
        }}
        allowTokenChange
      />
    </WalletAdapterProvider>
  );
}
```

To use **Reown AppKit** instead (the zero-config default), wrap your app in `<Provider>` with a
configured `WagmiAdapter`. See [Provider setup](/packages/react#configuration) for the full snippet,
and [SwapWidget props](/packages/react#swapwidget-props-swapprops) for every option.

## Vue

### 1. Install

::: code-group
```bash [pnpm]
pnpm add @uniswap-widget/vue ethers viem @wagmi/core \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
```
```bash [npm]
npm install @uniswap-widget/vue ethers viem @wagmi/core \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
```
```bash [yarn]
yarn add @uniswap-widget/vue ethers viem @wagmi/core \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
```
:::

### 2. Render the widget

The lightest path uses the injected-wallet adapter — no Reown or wagmi setup:

```vue
<script setup lang="ts">
import {
  WalletAdapterProvider,
  SwapWidget,
  useInjectedWalletAdapter,
} from '@uniswap-widget/vue';
</script>

<template>
  <WalletAdapterProvider :adapter="useInjectedWalletAdapter">
    <SwapWidget />
  </WalletAdapterProvider>
</template>
```

For the default Reown setup with `<UniswapProvider>`, see the [Vue package page](/packages/vue).

## Next steps

- **[React API](/packages/react)** / **[Vue API](/packages/vue)** — the complete reference.
- **[Wallet adapters](/packages/react#wallet-adapters-plugin)** — bring your own wallet library.
- **[Playground](/playground/)** — run the full example apps locally.
