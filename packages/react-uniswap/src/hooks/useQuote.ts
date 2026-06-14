import { useEffect, useRef } from "react";
import { ethers } from "ethers";
import {
  getQuote,
  RATE_LIMIT_CONFIG,
  type SwapState,
  type PoolConfig,
} from "@uniswap-widget/core";

/**
 * React binding for the core `getQuote`. Owns the reactive concerns  debounce,
 * de-duplication, abort, and state writes  while the actual quote logic lives
 * in `@uniswap-widget/core`.
 */
export default function useQuote({
  signer,
  state,
  setState,
  poolConfig,
}: {
  signer?: ethers.Signer;
  state: SwapState;
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  poolConfig: PoolConfig;
}) {
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const lastQuoteParams = useRef<string>("");
  const abortController = useRef<AbortController>();

  useEffect(() => {
    // Initialize tokens from pool config
    setState((prev) => ({
      ...prev,
      inputToken: poolConfig.tokenIn,
      outputToken: poolConfig.tokenOut,
    }));
  }, [poolConfig]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    async function updateQuote() {
      if (!state.inputAmount || Number(state.inputAmount) === 0) {
        setState((prev) => ({ ...prev, outputAmount: "" }));
        return;
      }

      if (!signer) {
        setState((prev) => ({
          ...prev,
          outputAmount: "",
          error: "Please connect your wallet to get quotes",
        }));
        return;
      }

      const quoteKey = `${poolConfig.tokenIn.address}-${poolConfig.tokenOut.address}-${state.inputAmount}`;
      if (lastQuoteParams.current === quoteKey) {
        return;
      }
      lastQuoteParams.current = quoteKey;

      const controller = new AbortController();
      abortController.current = controller;

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const { outputAmount, routeInfo } = await getQuote({
          signer,
          inputToken: poolConfig.tokenIn,
          outputToken: poolConfig.tokenOut,
          inputAmount: state.inputAmount,
          poolConfig,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setState((prev) => ({ ...prev, outputAmount, routeInfo }));
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Failed to get quote";

        setState((prev) => ({
          ...prev,
          outputAmount: "",
          error: errorMessage,
        }));
      } finally {
        if (!controller.signal.aborted) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    debounceTimeout.current = setTimeout(
      updateQuote,
      RATE_LIMIT_CONFIG.QUOTE_DEBOUNCE
    );

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [state.inputAmount, poolConfig, signer]);

  return;
}
