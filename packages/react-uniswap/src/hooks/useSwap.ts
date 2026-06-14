import { TokenSwapper } from "../libs/trading";
import { SwapState } from "../types";
import { ethers } from "ethers";

export default function useSwap({ 
  state, 
  setState,
  onSwap,
  signer
}: { 
  state: SwapState; 
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void>;
  signer?: ethers.Signer;
}) {

  async function swap() {
    if (!signer) {
      setState(prev => ({ ...prev, error: "Please connect your wallet" }));
      return;
    }

    setState((prev) => ({ ...prev, txLoading: true }));
    const swapper = new TokenSwapper(
      state.inputToken?.address as string,
      state.outputToken?.address as string,
      undefined,
      signer
    );
    try {
      console.log("Initial Token in balance:", await swapper.getTokenInBalance());
      console.log("Initial Token Out balance:", await swapper.getTokenOutBalance());

      const signerAddress = await swapper.getSignerAddress();
      const txHash = await swapper.executeSwap(
        state.inputAmount,
        state.outputAmount,
        signerAddress,
      );

      // Wait for transaction to be mined
      const provider = signer.provider;
      if (!provider) throw new Error("Provider not found");
      await provider.waitForTransaction(txHash);

      // Call onSwap callback if provided
      if (onSwap) {
        await onSwap(state.inputAmount, state.outputAmount);
      }

    } catch (error) {
      console.error("Error in main:", error);
      setState(prev => ({ ...prev, error: error instanceof Error ? error.message : "Swap failed" }));
    } finally {
      setState((prev) => ({ ...prev, txLoading: false }));
    }
  }

  return {
    swap
  }
}
