# @uniswap-widget/react

<img width="581" height="546" alt="image" src="https://github.com/user-attachments/assets/b98e27cd-3a08-4a1e-a018-f12ef1cd9bba" />

A React component package for easily integrating Uniswap swap functionality into your dApp with maximum dev flexibility  no token limitations, no warnings, and no added fee.

> Looking for a runnable end-to-end setup? See [`examples/basic`](https://github.com/houtan/uniswap-widget/tree/main/examples/basic) in the monorepo.

## Installation

The widget keeps its heavy dependencies as **peer dependencies**, so you install them alongside it (and stay in control of their versions):

```bash
pnpm add @uniswap-widget/react \
  @reown/appkit @reown/appkit-adapter-wagmi wagmi viem \
  @tanstack/react-query ethers \
  @uniswap/sdk-core @uniswap/v3-sdk @uniswap/v3-core
# or: npm install … / yarn add …
```

## Host-app requirements

The widget makes three assumptions about the app embedding it. Satisfy all three or it won't render/behave correctly. (These are tracked for removal  see the [decoupling spec](https://github.com/houtan/uniswap-widget/blob/main/docs/0004-core-deps-decoupling.md).)

### 1. Tailwind CSS

The widget is styled with **Tailwind utility classes** and ships **no CSS of its own**. Your app must run Tailwind and include the package in its `content` globs so those classes are generated:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@uniswap-widget/react/dist/*.js', // generate the widget's classes
  ],
}
```

### 2. API proxy

The widget calls these **relative** paths, which your app must proxy:

| Path | Method | Purpose | Required when |
|------|--------|---------|---------------|
| `/api/base-rpc` | POST | Base-chain JSON-RPC reads (balances, pool reserves, quotes) | Always |
| `/api/uniswap/v2/Search.v1.SearchService/SearchTokens` | POST | Token search | `searchConfig.enabled` is `true` |

See [`examples/basic/vite.config.ts`](https://github.com/houtan/uniswap-widget/blob/main/examples/basic/vite.config.ts) (dev proxy) and [`examples/basic/api`](https://github.com/houtan/uniswap-widget/tree/main/examples/basic/api) (Vercel functions) for a working reference.

### 3. Vite-style env

Configuration is read from `import.meta.env.VITE_*` (with sensible fallbacks), so the widget currently expects a **Vite** host. See [Environment Variables](#environment-variables).

## Configuration

### 1. WalletConnect Project ID

Get your WalletConnect v2 Project ID at https://cloud.walletconnect.com/

### 2. Provider setup

Wrap your app with the `Provider`, passing a configured `WagmiAdapter`:

```tsx
import { Provider, createAppKit, WagmiAdapter, base } from '@uniswap-widget/react';
import { QueryClient } from '@tanstack/react-query';

const projectId = 'your_project_id';
const queryClient = new QueryClient();

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata: {
    name: 'Your App Name',
    description: 'Your app description',
    url: 'https://your-domain.com',
    icons: ['https://your-icon-url.com'],
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
    allWallets: true,
    emailShowWallets: true,
    swaps: false,
  },
});

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <Provider wagmiAdapter={wagmiAdapter} queryClient={queryClient}>
      {children}
    </Provider>
  );
}
```

### Provider props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `wagmiAdapter` | `WagmiAdapter` | Yes | Configured `WagmiAdapter` instance |
| `queryClient` | `QueryClient` | No | React Query client (defaults to a new `QueryClient`) |
| `children` | `ReactNode` | Yes | Child components |

## Usage

```tsx
import { SwapWidget } from '@uniswap-widget/react';

export default function SwapPage() {
  const handleSwap = async (inputAmount: string, outputAmount: string) => {
    console.log('Swap:', { inputAmount, outputAmount });
    // Add your post-swap logic here
  };

  return (
    <SwapWidget
      poolConfig={{
        tokenIn: {
          chainId: 8453,
          address: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b',
          decimals: 18,
          symbol: 'VIRTUAL',
          name: 'Virtual Protocol',
          logoURI: 'https://assets.coingecko.com/coins/images/33154/standard/256x256_mark.png',
        },
        tokenOut: {
          chainId: 8453,
          address: '0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1',
          decimals: 18,
          symbol: 'SOLACE',
          name: 'Solace by Virtuals',
          logoURI: 'https://assets.coingecko.com/coins/images/32849/standard/solace_logo_256.png',
        },
        poolAddress: '0x912567c105A172777e56411DD0AA4Acc10e628a9',
        version: 'V2',
      }}
      allowTokenChange
      onSwap={handleSwap}
      searchConfig={{ enabled: true, chainIds: [8453] }}
    />
  );
}
```

### SwapWidget props (`SwapProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `poolConfig` | `PoolConfig` | No | The pool to trade against (see below) |
| `theme` | `Partial<ThemeConfig>` | No | Override colors/spacing. `lightTheme` / `darkTheme` are exported |
| `allowTokenChange` | `boolean` | No | Allow the user to switch tokens |
| `onTokenSelect` | `(type: 'input' \| 'output', token: TokenInfo) => void` | No | Fired on token selection |
| `onAmountChange` | `(amount: string, type: 'input' \| 'output') => void` | No | Fired on amount change |
| `onSwap` | `(inputAmount: string, outputAmount: string) => Promise<void>` | No | Called after a successful swap |
| `customTokenList` | `TokenInfo[]` | No | Restrict selectable tokens to this list |
| `searchConfig` | `{ enabled: boolean; chainIds?: number[] }` | No | Enable token search (requires the search proxy) |

### `PoolConfig`

| Field | Type | Description |
|-------|------|-------------|
| `tokenIn` / `tokenOut` | `TokenInfo` | The traded tokens (`chainId`, `address`, `decimals`, `symbol`, `name`, `logoURI`) |
| `poolAddress` | `string` | The pool/pair address |
| `version` | `'V2' \| 'V3'` | Pool type |
| `fee` | `number` | V3 fee tier (e.g. `500`, `3000`, `10000`) |

## Exports

- **Components:** `SwapWidget`, `Provider` (+ `ProviderProps`)
- **AppKit/wagmi re-exports:** `createAppKit`, `useAppKit`, `WagmiAdapter`, `CreateConnectorFn`
- **Networks:** `base`, `mainnet`, `polygon`, `optimism`, `arbitrum`, `avalanche`, `fantom`, `moonbeam`, `solana`
- **Themes:** `lightTheme`, `darkTheme`
- **Constants:** `VIRTUAL_PROTOCOL_TOKEN`, `DEFAULT_SLIPPAGE`, `DEFAULT_DEADLINE_MINUTES`, `VritualProtocolTokenInfo`, `SolaceTokenInfo`
- **Types:** `SwapProps`, `ThemeConfig`, `TokenInfo`, `PoolConfig`, `SwapState`, `AppKitNetwork`, `AppKitFeatures`, `AppKitMetadata`

## Requirements

- React 18 or higher
- A Vite-based host app (for `import.meta.env`)
- A valid WalletConnect v2 Project ID
- The API proxy described above

## Environment Variables

```env
VITE_REOWN_PROJECT_ID=your_project_id
VITE_APP_NAME=Your App Name
VITE_APP_DESCRIPTION=Your app description
VITE_APP_URL=https://your-domain.com
VITE_APP_ICON=https://your-icon-url.com

# Optional  token-change controls (default: true)
VITE_ALLOW_SELL_TOKEN_CHANGE=true
VITE_ALLOW_BUY_TOKEN_CHANGE=true
```

## License

MIT
