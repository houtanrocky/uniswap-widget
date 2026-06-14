import { ref } from "vue";
import type { ethers } from "ethers";
import { executeSwap } from "@uniswap-widget/core";
import type { WidgetState } from "./state";

/**
 * Vue binding for the core `executeSwap`. Manages the swapping/error state; the
 * swap itself (approve, send, wait, callback) lives in `@uniswap-widget/core`.
 */
export function useSwap(options: {
  state: WidgetState;
  getSigner: () => Promise<ethers.Signer | undefined>;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void> | void;
}) {
  const { state, getSigner, onSwap } = options;
  const isSwapping = ref(false);

  async function swap() {
    const signer = await getSigner();
    if (!signer) {
      state.error = "Please connect your wallet";
      return;
    }

    if (!state.inputToken || !state.outputToken) {
      state.error = "Tokens not initialized";
      return;
    }

    isSwapping.value = true;

    try {
      await executeSwap({
        signer,
        inputToken: state.inputToken,
        outputToken: state.outputToken,
        inputAmount: state.inputAmount,
        outputAmount: state.outputAmount,
        onSwap,
      });

      state.inputAmount = "";
      state.outputAmount = "";
    } catch (error) {
      state.error = error instanceof Error ? error.message : "Swap failed";
    } finally {
      isSwapping.value = false;
    }
  }

  return { swap, isSwapping };
}
