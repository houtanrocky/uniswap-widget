import { Token } from "@uniswap/sdk-core";
import type { FeeAmount } from "@uniswap/v3-sdk";

declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}

export interface TokenInfo {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoURI: string;
  logoUrl?: string;
  tokenId?: string;
  standard?: string;
  projectName?: string;
  isSpam?: string;
  safetyLevel?: string;
  feeData?: {
    sellFeeBps: string;
    buyFeeBps: string;
  };
  protectionInfo?: {
    result: string;
    tokenId: string;
    chainId: number;
    address: string;
    blockaidFees: {
      buy?: number;
      sell?: number;
    } | null;
    updatedAt: number;
  };
}

// Types for Uniswap Search API
export interface UniswapSearchTokenResponse {
  tokenId: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  standard: string;
  projectName: string;
  logoUrl?: string;
  isSpam: string;
  safetyLevel: string;
  feeData: {
    sellFeeBps: string;
    buyFeeBps: string;
  };
  protectionInfo: {
    result: string;
    tokenId: string;
    chainId: number;
    address: string;
    blockaidFees: {
      buy: number;
      sell: number;
    };
    updatedAt: number;
  };
}

export interface UniswapSearchResponse {
  tokens?: UniswapSearchTokenResponse[];
}

export interface TokenWithInfo {
  token: Token;
  info: TokenInfo;
}

export type TokenListType = 'sell' | 'buy';

export interface AppConfig {
  allowSellTokenChange: boolean;
  allowBuyTokenChange: boolean;
  sellTokens: TokenInfo[];
  buyTokens: TokenInfo[];
}

export interface SwapRouteInfo {
  isDirectRoute: boolean;
  directFee?: FeeAmount;
  firstLegFee?: FeeAmount;
  secondLegFee?: FeeAmount;
  intermediaryToken?: string;
}

export interface PoolConfig {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  poolAddress: string;
  version: 'V2' | 'V3';
  fee?: number; // Fee tier for V3 pools (e.g., 500, 3000, 10000)
}

export interface SwapState {
  inputAmount: string;
  outputAmount: string;
  inputToken: TokenInfo | null;
  outputToken: TokenInfo | null;
  loading: boolean;
  error: null | string;
  inputDisabled: boolean;
  routeInfo?: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };
}

export interface ThemeConfig {
  background: string;
  foreground: string;
  border: string;
  text: string;
  textSecondary: string;
  tokenButton: {
    background: string;
    text: string;
    border: string;
    paddingX: number;
    paddingY: number;
    hoverBackground?: string;
  };
  swapButton: {
    background: string;
    text: string;
    disabledBackground: string;
    disabledText: string;
    hoverBackground?: string;
  };
  connectButton: {
    background: string;
    text: string;
    hoverBackground?: string;
  };
  inputField: {
    background: string;
    text: string;
    placeholder: string;
    disabledBackground: string;
    disabledText: string;
  };
  buySection: {
    background: string;
    border: string;
  };
}

export interface SwapProps {
  poolConfig?: PoolConfig;
  theme?: Partial<ThemeConfig>;
  allowTokenChange?: boolean;
  onTokenSelect?: (tokenType: 'input' | 'output', token: TokenInfo) => void;
  onAmountChange?: (amount: string, tokenType: 'input' | 'output') => void;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
  customTokenList?: TokenInfo[];
  searchConfig?: {
    enabled: boolean;
    chainIds?: number[];
  };
}

// Default themes
export const lightTheme: ThemeConfig = {
  background: "#ffffff",
  foreground: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  textSecondary: "#6b7280",
  tokenButton: {
    background: "#f3f4f6",
    text: "#111827",
    border: "#e5e7eb",
    paddingX: 12,
    paddingY: 8,
    hoverBackground: "#e5e7eb",
  },
  swapButton: {
    background: "#4f46e5",
    text: "#ffffff",
    disabledBackground: "#e5e7eb",
    disabledText: "#9ca3af",
    hoverBackground: "#4338ca",
  },
  connectButton: {
    background: "#4f46e5",
    text: "#ffffff",
    hoverBackground: "#4338ca",
  },
  inputField: {
    background: "#ffffff",
    text: "#111827",
    placeholder: "#9ca3af",
    disabledBackground: "#f3f4f6",
    disabledText: "#9ca3af",
  },
  buySection: {
    background: "#f9fafb",
    border: "#e5e7eb",
  },
};

export const darkTheme: ThemeConfig = {
  background: '#191919',
  foreground: '#232323',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  border: '#2D2D2D',
  
  tokenButton: {
    background: '#2D2D2D',
    text: '#FFFFFF',
    border: '#3D3D3D',
    paddingY: 10,
    paddingX: 10
  },
  swapButton: {
    background: '#FF007A',
    text: '#FFFFFF',
    hoverBackground: '#FF1A8C',
    disabledBackground: '#2D2D2D',
    disabledText: '#666666'
  },
  connectButton: {
    background: '#2D0219',
    text: '#FF007A',
    hoverBackground: '#3D031F'
  },
  inputField: {
    background: 'transparent',
    text: '#FFFFFF',
    placeholder: '#666666',
    disabledBackground: "#2D2D2D",
    disabledText: "#666666"
  },
  buySection: {
    background: '#232323',
    border: '#2D2D2D'
  }
};
