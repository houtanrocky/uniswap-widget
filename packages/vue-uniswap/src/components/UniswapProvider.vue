<script setup lang="ts">
import { provide } from "vue";
import type { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { UNISWAP_WIDGET_KEY, type AppKitLike } from "../context";

/**
 * Provides the wagmi config + AppKit instance to the widget. The Vue
 * counterpart of `@uniswap-widget/react`'s `<Provider>`  except `@wagmi/core` needs no
 * React-Query client, so this is just a context provider around the slot.
 */
const props = defineProps<{
  wagmiAdapter: WagmiAdapter;
  appKit: AppKitLike;
}>();

provide(UNISWAP_WIDGET_KEY, {
  wagmiConfig: props.wagmiAdapter.wagmiConfig,
  appKit: props.appKit,
});
</script>

<template>
  <slot />
</template>
