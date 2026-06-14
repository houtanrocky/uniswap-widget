import { onUnmounted, watch, type Ref } from "vue";
import type { ethers } from "ethers";
import {
  getQuote,
  RATE_LIMIT_CONFIG,
  type PoolConfig,
} from "@uniswap-widget/core";
import type { WidgetState } from "./state";

/**
 * Vue binding for the core `getQuote`. Owns debounce, de-duplication, and abort;
 * the quote logic itself lives in `@uniswap-widget/core`.
 */
export function useQuote(options: {
  state: WidgetState;
  poolConfig: Ref<PoolConfig>;
  getSigner: () => Promise<ethers.Signer | undefined>;
}) {
  const { state, poolConfig, getSigner } = options;

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;
  let lastQuoteKey = "";

  // Keep the state's tokens in sync with the pool config.
  watch(
    poolConfig,
    (cfg) => {
      state.inputToken = cfg.tokenIn;
      state.outputToken = cfg.tokenOut;
    },
    { immediate: true }
  );

  watch(
    () => [state.inputAmount, poolConfig.value] as const,
    () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (controller) controller.abort();

      const run = async () => {
        const cfg = poolConfig.value;

        if (!state.inputAmount || Number(state.inputAmount) === 0) {
          state.outputAmount = "";
          return;
        }

        const signer = await getSigner();
        if (!signer) {
          state.outputAmount = "";
          state.error = "Please connect your wallet to get quotes";
          return;
        }

        const quoteKey = `${cfg.tokenIn.address}-${cfg.tokenOut.address}-${state.inputAmount}`;
        if (lastQuoteKey === quoteKey) return;
        lastQuoteKey = quoteKey;

        const ctrl = new AbortController();
        controller = ctrl;

        try {
          state.loading = true;
          state.error = null;

          const { outputAmount, routeInfo } = await getQuote({
            signer,
            inputToken: cfg.tokenIn,
            outputToken: cfg.tokenOut,
            inputAmount: state.inputAmount,
            poolConfig: cfg,
            signal: ctrl.signal,
          });

          if (ctrl.signal.aborted) return;

          state.outputAmount = outputAmount;
          state.routeInfo = routeInfo;
        } catch (err) {
          if (ctrl.signal.aborted) return;
          state.outputAmount = "";
          state.error = err instanceof Error ? err.message : "Failed to get quote";
        } finally {
          if (!ctrl.signal.aborted) state.loading = false;
        }
      };

      debounceTimer = setTimeout(run, RATE_LIMIT_CONFIG.QUOTE_DEBOUNCE);
    }
  );

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (controller) controller.abort();
  });
}
