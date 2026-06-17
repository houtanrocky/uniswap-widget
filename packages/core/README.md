# @uniswap-widget/core

Framework-agnostic core for the Uniswap swap widget. This package contains the
parts that don't care which UI framework you use:

- **Trading logic**  `TokenSwapper`, plus the shared `getQuote`, `executeSwap`,
  and `searchTokens` operations.
- **RPC layer**  rate-limited Base providers (`getProvider`,
  `makeProviderRequest`), pool lookups, and dynamic fee-tier selection.
- **Types & themes**  `TokenInfo`, `PoolConfig`, `SwapState`, `ThemeConfig`,
  `SwapProps`, `lightTheme`, `darkTheme`, and the verified token constants.

The framework bindings build their UI on top of this:

| Package                  | Framework |
| ------------------------ | --------- |
| [`@uniswap-widget/react`](https://github.com/houtan-rocky/uniswap-widget/tree/main/packages/react-uniswap) | React |
| [`@uniswap-widget/vue`](https://github.com/houtan-rocky/uniswap-widget/tree/main/packages/vue-uniswap) | Vue 3 |

## Why a separate core?

The reactive hooks/composables in each binding are thin wrappers around the
functions here, so there's exactly one implementation of "get a quote", "run a
swap", and "search tokens". Adding a new framework means writing a new UI layer
 never re-implementing the trading logic.

```ts
import { getQuote, executeSwap, searchTokens, TokenSwapper } from "@uniswap-widget/core";
```

## Peer dependencies

The web3/uniswap stack is provided by the host app:

- `ethers` (v5)
- `@uniswap/sdk-core`, `@uniswap/v3-sdk`, `@uniswap/v3-core`

## Host requirements

Network calls expect the host app to proxy two paths (see the examples'
`vite.config` for a dev-server setup):

- `/api/base-rpc` → a Base RPC endpoint
- `/api/uniswap/v2/...` → Uniswap's token search API
