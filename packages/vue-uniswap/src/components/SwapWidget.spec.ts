import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

// Stub the wallet layer so mounting performs no real connection / network.
vi.mock("@wagmi/core", () => ({
  getAccount: vi.fn(() => ({ isConnected: false, address: undefined })),
  watchAccount: vi.fn(() => () => {}),
  reconnect: vi.fn().mockResolvedValue(undefined),
  getWalletClient: vi.fn().mockResolvedValue(null),
}));

// Keep the real core values (DEFAULT_POOL_CONFIG, lightTheme) but stub the
// network-touching functions.
vi.mock("@uniswap-widget/core", async (importActual) => {
  const actual = await importActual<typeof import("@uniswap-widget/core")>();
  return { ...actual, getQuote: vi.fn(), executeSwap: vi.fn() };
});

import SwapWidget from "./SwapWidget.vue";
import { UNISWAP_WIDGET_KEY } from "../context";

function mountWidget(appKit: { open: ReturnType<typeof vi.fn> } = { open: vi.fn() }) {
  return mount(SwapWidget, {
    global: {
      provide: {
        [UNISWAP_WIDGET_KEY as symbol]: {
          wagmiConfig: {} as never,
          appKit,
        },
      },
    },
  });
}

describe("SwapWidget.vue", () => {
  it("renders the default token pair and a Connect Wallet button when disconnected", () => {
    const wrapper = mountWidget();
    const text = wrapper.text();
    expect(text).toContain("VIRTUAL");
    expect(text).toContain("SOLACE");
    expect(text).toContain("Connect Wallet");
  });

  it("opens AppKit when Connect Wallet is clicked", async () => {
    const appKit = { open: vi.fn() };
    const wrapper = mountWidget(appKit);
    await wrapper.get("button").trigger("click");
    expect(appKit.open).toHaveBeenCalledWith({ view: "Connect" });
  });

  it("disables the sell input while disconnected", () => {
    const wrapper = mountWidget();
    const input = wrapper.get('input[inputmode="decimal"]');
    expect((input.element as HTMLInputElement).disabled).toBe(true);
  });
});
