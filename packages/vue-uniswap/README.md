# @uniswap-widget/vue

A Vue 3 Uniswap swap widget, built on
[`@uniswap-widget/core`](../core). The same trading logic that powers
[`@uniswap-widget/react`](../react-uniswap)  exposed as Vue components and composables.

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
- **`<UniswapProvider>`**  provides the wagmi config + AppKit instance to the
  widget via Vue's `provide`/`inject`.
- **Composables**  `useWallet`, `useQuote`, `useSwap`, `createWidgetState` for
  building your own UI on the core.

## Wallet layer

Unlike the React binding (which uses the `wagmi` React hooks), this package talks
to `@wagmi/core` directly and adapts the connected wallet into an
`ethers.Signer`  exactly the input the core swap functions expect. That keeps
the dependency surface to the already-pinned web3 stack: no `@wagmi/vue` or
`@tanstack/vue-query` required.

## Peer dependencies

Provided by the host app: `vue`, `@wagmi/core`, `viem`, `@reown/appkit`,
`@reown/appkit-adapter-wagmi`, `ethers`, and the `@uniswap/*` SDKs.

## Host requirements

The widget's network calls expect the host to proxy `/api/base-rpc` and
`/api/uniswap/v2/...` (see `examples/vue/vite.config.ts`).
