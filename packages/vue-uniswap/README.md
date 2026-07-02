# @uniswap-widget/vue

[![npm version](https://img.shields.io/npm/v/@uniswap-widget/vue.svg)](https://www.npmjs.com/package/@uniswap-widget/vue)
[![npm downloads](https://img.shields.io/npm/dm/@uniswap-widget/vue.svg)](https://www.npmjs.com/package/@uniswap-widget/vue)
[![license](https://img.shields.io/npm/l/@uniswap-widget/vue.svg)](https://github.com/houtanrocky/uniswap-widget/blob/main/LICENSE)

A Vue 3 Uniswap swap widget, built on
[`@uniswap-widget/core`](https://github.com/houtanrocky/uniswap-widget/tree/main/packages/core). The same trading logic that powers
[`@uniswap-widget/react`](https://github.com/houtanrocky/uniswap-widget/tree/main/packages/react-uniswap)  exposed as Vue components and composables.

```vue
<script setup lang="ts">
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit";
import { base } from "@reown/appkit/networks";
import { UniswapProvider, SwapWidget } from "@uniswap-widget/vue";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
const wagmiAdapter = new WagmiAdapter({ projectId, networks: [base] });
const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
});
</script>

<template>
  <UniswapProvider :wagmi-adapter="wagmiAdapter" :app-kit="appKit">
    <SwapWidget />
  </UniswapProvider>
</template>
```

## What's in the box

- **`<SwapWidget>`**  the swap UI (a port of the React widget).
- **`<UniswapProvider>`**  the default provider: wagmi config + AppKit instance,
  with the Reown wallet adapter wired in.
- **`<WalletAdapterProvider>`** + adapters  the wallet plugin (see below):
  `useReownWalletAdapter` (default), `useInjectedWalletAdapter`.
- **Composables**  `useWallet`, `useQuote`, `useSwap`, `createWidgetState` for
  building your own UI on the core.

## Wallet adapters (plugin)

The widget is **wallet-agnostic** — it reads the connected account and an ethers
`Signer` from a small adapter (a Vue composable), so Reown AppKit is just the
default. Plug in any wallet library:

- **Default (Reown AppKit):** use `<UniswapProvider>` as shown above.
- **Another wallet library:** pass `walletAdapter` to `<UniswapProvider>`, or
  skip it and wrap `<SwapWidget>` in `<WalletAdapterProvider :adapter="…">`.

A `WalletAdapter` is a composable returning a `WalletConnection`:

```ts
interface WalletConnection {
  isConnected: Ref<boolean>;
  address: Ref<string | undefined>;
  getSigner: () => Promise<ethers.Signer | undefined>;  // what the core needs
  connect: () => void | Promise<void>;
  disconnect?: () => void | Promise<void>;
  AccountButton?: Component;                             // optional account UI
}
type WalletAdapter = () => WalletConnection;
```

### Built-in: injected wallet (no Reown, no wagmi)

`useInjectedWalletAdapter` talks to `window.ethereum` using only `ethers`:

```vue
<script setup lang="ts">
import {
  WalletAdapterProvider,
  SwapWidget,
  useInjectedWalletAdapter,
} from "@uniswap-widget/vue";
</script>

<template>
  <WalletAdapterProvider :adapter="useInjectedWalletAdapter">
    <SwapWidget />
  </WalletAdapterProvider>
</template>
```

The default adapter still talks to `@wagmi/core` directly (no `@wagmi/vue` or
`@tanstack/vue-query` required).

## Peer dependencies

Provided by the host app: `vue`, `@wagmi/core`, `viem`, `ethers`, and the
`@uniswap/*` SDKs. `@reown/appkit` + `@reown/appkit-adapter-wagmi` are
**optional** (only for the default Reown adapter).

## Host requirements

The widget's network calls expect the host to proxy `/api/base-rpc` and
`/api/uniswap/v2/...` (see `examples/vue/vite.config.ts`).
