import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@uniswap-widget/core", () => ({ executeSwap: vi.fn() }));

import { executeSwap } from "@uniswap-widget/core";
import type { TokenInfo } from "@uniswap-widget/core";
import { useSwap } from "./useSwap";
import { createWidgetState } from "./state";

const tokenIn = {
  chainId: 8453,
  address: "0xaaa",
  decimals: 18,
  symbol: "VIRTUAL",
  name: "Virtual",
  logoURI: "",
} as TokenInfo;
const tokenOut = {
  chainId: 8453,
  address: "0xbbb",
  decimals: 18,
  symbol: "SOLACE",
  name: "Solace",
  logoURI: "",
} as TokenInfo;
const signer = {} as never;

beforeEach(() => vi.clearAllMocks());

describe("useSwap", () => {
  it("runs the swap and clears the amounts on success", async () => {
    vi.mocked(executeSwap).mockResolvedValue("0xhash");
    const state = createWidgetState();
    state.inputToken = tokenIn;
    state.outputToken = tokenOut;
    state.inputAmount = "1";
    state.outputAmount = "2";

    const { swap, isSwapping } = useSwap({
      state,
      getSigner: vi.fn().mockResolvedValue(signer),
    });
    await swap();

    expect(executeSwap).toHaveBeenCalledWith(
      expect.objectContaining({
        signer,
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: "1",
        outputAmount: "2",
      })
    );
    expect(state.inputAmount).toBe("");
    expect(state.outputAmount).toBe("");
    expect(isSwapping.value).toBe(false);
  });

  it("sets an error and skips the swap when no signer is available", async () => {
    const state = createWidgetState();
    state.inputToken = tokenIn;
    state.outputToken = tokenOut;

    const { swap } = useSwap({
      state,
      getSigner: vi.fn().mockResolvedValue(undefined),
    });
    await swap();

    expect(state.error).toBe("Please connect your wallet");
    expect(executeSwap).not.toHaveBeenCalled();
  });

  it("sets an error when tokens are not initialized", async () => {
    const state = createWidgetState();
    const { swap } = useSwap({
      state,
      getSigner: vi.fn().mockResolvedValue(signer),
    });
    await swap();

    expect(state.error).toBe("Tokens not initialized");
    expect(executeSwap).not.toHaveBeenCalled();
  });

  it("surfaces errors thrown by the core swap", async () => {
    vi.mocked(executeSwap).mockRejectedValue(new Error("boom"));
    const state = createWidgetState();
    state.inputToken = tokenIn;
    state.outputToken = tokenOut;
    state.inputAmount = "1";
    state.outputAmount = "2";

    const { swap } = useSwap({
      state,
      getSigner: vi.fn().mockResolvedValue(signer),
    });
    await swap();

    expect(state.error).toBe("boom");
  });
});
