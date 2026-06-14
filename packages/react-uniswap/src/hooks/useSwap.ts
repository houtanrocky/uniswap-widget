import { ethers } from "ethers";
import { executeSwap, type SwapState } from "@uniswap-widget/core";

/**
 * React binding for the core `executeSwap`. Manages loading/error state; the
 * swap itself (approve, send, wait, callback) lives in `@uniswap-widget/core`.
 */
export default function useSwap({
  state,
  setState,
  onSwap,
  signer,
}: {
  state: SwapState;
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
  signer?: ethers.Signer;
}) {
  async function swap() {
    if (!signer) {
      setState((prev) => ({ ...prev, error: "Please connect your wallet" }));
      return;
    }

    if (!state.inputToken || !state.outputToken) {
      setState((prev) => ({ ...prev, error: "Tokens not initialized" }));
      return;
    }

    setState((prev) => ({ ...prev, txLoading: true }));

    try {
      await executeSwap({
        signer,
        inputToken: state.inputToken,
        outputToken: state.outputToken,
        inputAmount: state.inputAmount,
        outputAmount: state.outputAmount,
        onSwap,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Swap failed",
      }));
    } finally {
      setState((prev) => ({ ...prev, txLoading: false }));
    }
  }

  return {
    swap,
  };
}
