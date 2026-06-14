"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

export interface ProviderProps {
  children: React.ReactNode;
  wagmiAdapter: WagmiAdapter;
  queryClient?: QueryClient;
}

export function Provider({
  children,
  wagmiAdapter,
  queryClient = new QueryClient(),
}: ProviderProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
