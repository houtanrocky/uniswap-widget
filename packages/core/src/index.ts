// =============================================================================
// @uniswap-widget/core  framework-agnostic toolkit
//
// Everything here is plain TypeScript: trading logic, providers, types, and
// theme data. No React, Vue, wagmi, or AppKit. Framework bindings
// (`uniswap-widget/react`, `@uniswap-widget/vue`, ... ) build their UI on top of this.
// =============================================================================

// --- Trading logic ----------------------------------------------------------
export { TokenSwapper } from "./libs/trading";

// Shared swap operations  the reactive hooks/composables in each framework
// binding are thin wrappers around these.
export { getQuote } from "./swap/quote";
export type { GetQuoteParams, QuoteResult } from "./swap/quote";
export { executeSwap } from "./swap/execute";
export type { ExecuteSwapParams } from "./swap/execute";
export { searchTokens, convertSearchTokenToInfo } from "./swap/search";
export type { SearchTokensOptions } from "./swap/search";

// --- RPC providers & on-chain reads -----------------------------------------
export {
  getProvider,
  getMultiChainProviders,
  getSupportedChainIds,
  getChainConfig,
  isSupportedChain,
  clearRequestCache,
  makeProviderRequest,
} from "./libs/provider";
export { getPoolInfo } from "./libs/pool";
export {
  ALL_FEE_TIERS,
  getBestFeeTier,
  getOptimalFeeTier,
  getSafeFeeTier,
  getSmartFeeTier,
  formatFeeDisplay,
  getFeeDescription,
  shouldTryDirectPair,
  formatFeeTier,
} from "./libs/dynamicFees";

// --- Amount / address helpers -----------------------------------------------
export { fromReadableAmount } from "./utils/conversion";
export { toReadableAmount, displayTrade } from "./libs/utils";
export { toChecksumAddress } from "./utils/addresses";

// --- Config ------------------------------------------------------------------
export { RATE_LIMIT_CONFIG, getChainRateLimitSettings } from "./config/rateLimit";
export { DEFAULT_POOL_CONFIG } from "./config/tokens";

// --- Constants (tokens, addresses, ABIs) ------------------------------------
// Star-exports the legacy `TokenInfo` interface declared in constants.ts too,
// but the explicit `./types` re-export below shadows it with the canonical one.
export * from "./constants";

// --- Canonical types & themes -----------------------------------------------
// Explicit named re-exports take precedence over the star-exported names above.
export type {
  TokenInfo,
  UniswapSearchTokenResponse,
  UniswapSearchResponse,
  TokenWithInfo,
  TokenListType,
  AppConfig,
  SwapRouteInfo,
  PoolConfig,
  SwapState,
  ThemeConfig,
  SwapProps,
} from "./types";
export { lightTheme, darkTheme } from "./types";
