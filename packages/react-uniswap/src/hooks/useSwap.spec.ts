import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@uniswap-widget/core", () => ({ executeSwap: vi.fn() }));

import { executeSwap } from "@uniswap-widget/core";
import type { SwapState, TokenInfo } from "@uniswap-widget/core";
import useSwap from "./useSwap";

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

function makeHarness(overrides: Partial<SwapState> = {}) {
  let state = {
    inputAmount: "1",
    outputAmount: "2",
    inputToken: tokenIn,
    outputToken: tokenOut,
    loading: false,
    error: null,
    inputDisabled: false,
    ...overrides,
  } as SwapState;
  const setState = vi.fn((updater: unknown) => {
    state =
      typeof updater === "function"
        ? (updater as (prev: SwapState) => SwapState)(state)
        : (updater as SwapState);
  });
  return {
    get state() {
      return state;
    },
    setState,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("useSwap (react wrapper)", () => {
  it("delegates to core executeSwap with the state's tokens + amounts", async () => {
    vi.mocked(executeSwap).mockResolvedValue("0xhash");
    const h = makeHarness();
    const { swap } = useSwap({
      state: h.state,
      setState: h.setState,
      signer: {} as never,
    });
    await swap();

    expect(executeSwap).toHaveBeenCalledWith(
      expect.objectContaining({
        inputToken: tokenIn,
        outputToken: tokenOut,
        inputAmount: "1",
        outputAmount: "2",
      })
    );
  });

  it("sets an error and skips the swap when there is no signer", async () => {
    const h = makeHarness();
    const { swap } = useSwap({
      state: h.state,
      setState: h.setState,
      signer: undefined,
    });
    await swap();

    expect(h.state.error).toBe("Please connect your wallet");
    expect(executeSwap).not.toHaveBeenCalled();
  });
});
