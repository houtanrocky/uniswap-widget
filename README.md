# Uniswap Widget Package

<img width="581" height="546" alt="image" src="https://github.com/user-attachments/assets/b98e27cd-3a08-4a1e-a018-f12ef1cd9bba" />


A React component package for easily integrating Uniswap swap functionality into your dApp with maximum dev flexibility, and no limitation, no warnings on any token, and no fee.

## Installation

```bash
npm install uniswap-widget-package @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query
# or
yarn add uniswap-widget-package @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query
# or
pnpm add uniswap-widget-package @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query
```

## Configuration

### 1. WalletConnect Project ID
Get your WalletConnect v2 Project ID at: https://cloud.walletconnect.com/

### 2. Provider Setup

Set up the Provider with WagmiAdapter and AppKit:

```tsx
import { Provider, createAppKit } from 'uniswap-widget-package';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// Setup
const projectId = 'your_project_id';
const queryClient = new QueryClient();

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
  ssr: true
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata: {
    name: "Your App Name",
    description: "Your app description",
    url: "https://your-domain.com",
    icons: ["https://your-icon-url.com"],
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
    allWallets: true,
    emailShowWallets: true,
    swaps: false,
  }
});

// Wrap your app with the Provider
export default function App({ children }) {
  return (
    <Provider wagmiAdapter={wagmiAdapter} queryClient={queryClient}>
      {children}
    </Provider>
  );
}
```

## Provider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| wagmiAdapter | WagmiAdapter | Yes | Configured WagmiAdapter instance |
| queryClient | QueryClient | No | React Query client instance (defaults to new QueryClient) |
| children | ReactNode | Yes | Child components |

## Usage

```tsx
import { SwapWidget } from 'uniswap-widget-package';

export default function SwapPage() {
  const handleSwap = async (inputAmount: string, outputAmount: string) => {
    console.log("Swap:", { inputAmount, outputAmount });
    // Add your swap logic here
  };

  return (
    <SwapWidget 
      poolConfig={{
        tokenIn: {
          // Your token configuration
        },
        tokenOut: {
          // Your token configuration
        },
        poolAddress: "your_pool_address",
        version: "V2"
      }}
      allowTokenChange={true}
      onSwap={handleSwap}
      searchConfig={{
        enabled: true,
        chainIds: [8453] // Base chain
      }}
    />
  );
}
```

## Requirements

- React 18 or higher
- Valid WalletConnect v2 Project ID
- Supported networks configuration

## Features

- Easy integration with React applications
- Built-in wallet connection via WalletConnect v2
- Customizable UI
- TypeScript support
- Multi-chain support
- SSR support
- Mobile wallet support
- Configurable AppKit features

## Environment Variables

```env
VITE_REOWN_PROJECT_ID=your_project_id
VITE_APP_URL=your_app_url
```

## License

MIT
