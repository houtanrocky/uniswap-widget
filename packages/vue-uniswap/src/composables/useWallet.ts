import { inject, onMounted, onUnmounted, ref } from "vue";
import { ethers } from "ethers";
import {
  getAccount,
  getWalletClient,
  reconnect,
  watchAccount,
} from "@wagmi/core";
import { UNISWAP_WIDGET_KEY } from "../context";

/**
 * Wallet binding for Vue.
 *
 * Tracks connection state from `@wagmi/core` and lazily adapts the connected
 * viem wallet client into an `ethers.Signer`  the exact shape the core swap
 * functions expect. This is the Vue equivalent of the React widget's
 * `useAccount` + `useWalletClient` + `Web3Provider` dance.
 */
export function useWallet() {
  const ctx = inject(UNISWAP_WIDGET_KEY);
  if (!ctx) {
    throw new Error("useWallet() must be used inside <UniswapProvider>");
  }
  const { wagmiConfig, appKit } = ctx;

  const initial = getAccount(wagmiConfig);
  const isConnected = ref(initial.isConnected);
  const address = ref<string | undefined>(initial.address);

  let unwatch: (() => void) | undefined;

  onMounted(() => {
    // Restore a previous session if there is one.
    reconnect(wagmiConfig).catch(() => {
      /* no previous session  fine */
    });

    unwatch = watchAccount(wagmiConfig, {
      onChange(account) {
        isConnected.value = account.isConnected;
        address.value = account.address;
      },
    });
  });

  onUnmounted(() => {
    unwatch?.();
  });

  /** Resolve the connected wallet as an ethers signer (or undefined). */
  async function getSigner(): Promise<ethers.Signer | undefined> {
    const walletClient = await getWalletClient(wagmiConfig).catch(() => null);
    if (!walletClient) return undefined;

    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.providers.Web3Provider(transport, network);
    return provider.getSigner(account.address);
  }

  /** Open the AppKit connect modal. */
  function open() {
    void appKit.open({ view: "Connect" });
  }

  return { isConnected, address, getSigner, open };
}
