<script setup lang="ts">
import { computed } from "vue";
import {
  DEFAULT_POOL_CONFIG,
  lightTheme,
  type PoolConfig,
  type ThemeConfig,
  type TokenInfo,
} from "@uniswap-widget/core";
import { createWidgetState } from "../composables/state";
import { useWallet } from "../composables/useWallet";
import { useQuote } from "../composables/useQuote";
import { useSwap } from "../composables/useSwap";

const props = withDefaults(
  defineProps<{
    poolConfig?: PoolConfig;
    theme?: Partial<ThemeConfig>;
    allowTokenChange?: boolean;
    onSwap?: (inputAmount: string, outputAmount: string) => Promise<void> | void;
  }>(),
  {
    poolConfig: () => DEFAULT_POOL_CONFIG,
    theme: () => ({}),
    allowTokenChange: true,
    onSwap: undefined,
  }
);

const poolConfig = computed(() => props.poolConfig);

// Deep-merge the caller's theme over the light default (one level deep, matching
// the React widget).
const theme = computed<ThemeConfig>(() => {
  const custom = props.theme ?? {};
  return {
    ...lightTheme,
    ...custom,
    tokenButton: { ...lightTheme.tokenButton, ...custom.tokenButton },
    swapButton: { ...lightTheme.swapButton, ...custom.swapButton },
    connectButton: { ...lightTheme.connectButton, ...custom.connectButton },
    inputField: { ...lightTheme.inputField, ...custom.inputField },
    buySection: { ...lightTheme.buySection, ...custom.buySection },
  };
});

const state = createWidgetState();
const { isConnected, getSigner, open } = useWallet();

useQuote({ state, poolConfig, getSigner });
const { swap, isSwapping } = useSwap({ state, getSigner, onSwap: props.onSwap });

const swapDisabled = computed(
  () =>
    state.loading ||
    isSwapping.value ||
    !state.inputAmount ||
    Number(state.inputAmount) <= 0
);

const priceRatio = computed(() => {
  if (!state.inputAmount || !state.outputAmount) return "";
  return (Number(state.outputAmount) / Number(state.inputAmount)).toFixed(6);
});

function handleInputAmountChange(event: Event) {
  const el = event.target as HTMLInputElement;
  const value = el.value;
  if (value === "" || /^\d*\.?\d*$/.test(value)) {
    state.inputAmount = value;
  } else {
    // Revert invalid input (mirrors the React controlled input).
    el.value = state.inputAmount;
  }
}

function handleImageError(event: Event) {
  (event.target as HTMLImageElement).style.display = "none";
}

function tokenLogo(token: TokenInfo): string | undefined {
  return token.logoURI || token.logoUrl;
}
</script>

<template>
  <div
    class="relative w-full max-w-md rounded-xl p-2"
    :style="{ backgroundColor: theme.background }"
  >
    <!-- Sell Section -->
    <div
      class="p-4 rounded-2xl relative"
      :style="{
        backgroundColor: theme.foreground,
        border: `1px solid ${theme.border}`,
        opacity: !isConnected ? 0.5 : 1,
      }"
    >
      <label class="block mb-2" :style="{ color: theme.textSecondary }">Sell</label>
      <div class="flex items-center">
        <input
          type="text"
          :disabled="!isConnected"
          :value="state.inputAmount"
          inputmode="decimal"
          placeholder="0"
          :class="['w-full text-2xl outline-none', !isConnected && 'cursor-not-allowed']"
          :style="{
            backgroundColor: !isConnected
              ? theme.inputField.disabledBackground
              : theme.inputField.background,
            color: !isConnected
              ? theme.inputField.disabledText
              : theme.inputField.text,
          }"
          @input="handleInputAmountChange"
        />
        <div class="flex flex-col gap-2">
          <div
            :class="[
              'ml-2 p-3 py-2 rounded-full flex items-center justify-center gap-2 min-w-[140px]',
              !isConnected && 'opacity-50',
            ]"
            :style="{
              backgroundColor: theme.tokenButton.background,
              border: `1px solid ${theme.tokenButton.border}`,
            }"
          >
            <img
              v-if="tokenLogo(poolConfig.tokenIn)"
              :src="tokenLogo(poolConfig.tokenIn)"
              :alt="poolConfig.tokenIn.symbol"
              class="h-[20px] w-[20px] flex-shrink-0 rounded-full"
              @error="handleImageError"
            />
            <span class="font-bold text-sm" :style="{ color: theme.tokenButton.text }">
              {{ poolConfig.tokenIn.symbol }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Swap Arrow -->
    <div class="relative z-10 flex justify-center items-center h-[5px]">
      <div
        class="rounded-2xl w-[40px] h-[40px] flex justify-center items-center"
        :style="{ backgroundColor: theme.border, opacity: !isConnected ? 0.5 : 1 }"
      >
        <svg
          viewBox="0 0 512 512"
          class="text-2xl w-6 h-6"
          fill="currentColor"
          :style="{ color: theme.text }"
        >
          <path d="M256 400L56 200h400L256 400z" />
        </svg>
      </div>
    </div>

    <!-- Buy Section -->
    <div
      class="mb-2 p-4 rounded-2xl relative"
      :style="{
        backgroundColor: theme.buySection.background,
        border: `1px solid ${theme.buySection.border}`,
        opacity: !isConnected ? 0.5 : 1,
      }"
    >
      <label class="block mb-2" :style="{ color: theme.textSecondary }">Buy</label>
      <div class="flex items-center">
        <input
          type="text"
          readonly
          disabled
          :value="state.loading ? 'Fetching Quotes' : state.outputAmount || '0'"
          placeholder="0"
          :class="[
            'w-full text-2xl outline-none disabled:text-lg',
            !isConnected && 'cursor-not-allowed',
          ]"
          :style="{
            backgroundColor: !isConnected
              ? theme.inputField.disabledBackground
              : theme.inputField.background,
            color: !isConnected
              ? theme.inputField.disabledText
              : theme.inputField.text,
            opacity: state.loading ? 0.3 : !isConnected ? 0.5 : 0.8,
          }"
        />
        <div class="flex flex-col gap-2">
          <div
            :class="[
              'ml-2 p-3 py-2 rounded-full flex items-center justify-center gap-2 min-w-[140px]',
              !isConnected && 'opacity-50',
            ]"
            :style="{
              backgroundColor: theme.tokenButton.background,
              border: `1px solid ${theme.tokenButton.border}`,
              padding: `${theme.tokenButton.paddingY}px ${theme.tokenButton.paddingX}px`,
            }"
          >
            <img
              v-if="tokenLogo(poolConfig.tokenOut)"
              :src="tokenLogo(poolConfig.tokenOut)"
              :alt="poolConfig.tokenOut.symbol"
              class="h-[20px] w-[20px] flex-shrink-0 rounded-full"
              @error="handleImageError"
            />
            <span class="font-bold text-sm" :style="{ color: theme.tokenButton.text }">
              {{ poolConfig.tokenOut.symbol }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="state.error"
      class="mb-2 p-4 bg-red-50 text-red-500 rounded-2xl overflow-x-hidden"
    >
      {{ state.error }}
    </div>

    <!-- Action Button -->
    <button
      v-if="isConnected"
      :disabled="swapDisabled"
      class="w-full py-4 rounded-2xl transition-colors cursor-pointer"
      :style="{
        backgroundColor: swapDisabled
          ? theme.swapButton.disabledBackground
          : theme.swapButton.background,
        color: swapDisabled ? theme.swapButton.disabledText : theme.swapButton.text,
      }"
      @click="swap"
    >
      {{ isSwapping ? "Swapping..." : state.loading ? "Getting Quote..." : "Swap" }}
    </button>
    <button
      v-else
      class="w-full py-4 rounded-2xl transition-colors"
      :style="{
        backgroundColor: theme.connectButton.background,
        color: theme.connectButton.text,
      }"
      @click="open"
    >
      Connect Wallet
    </button>

    <!-- Price Info -->
    <div v-if="state.inputAmount && state.outputAmount" class="p-4 rounded-2xl">
      <div
        class="flex justify-between items-center text-sm mb-2"
        :style="{ color: theme.textSecondary }"
      >
        1 {{ poolConfig.tokenIn.symbol }} = {{ priceRatio }}
        {{ poolConfig.tokenOut.symbol }}
      </div>

      <div
        v-if="state.routeInfo"
        class="mt-2 text-xs"
        :style="{ color: theme.textSecondary }"
      >
        <div class="flex justify-between">
          <span>{{ state.routeInfo.isDirectRoute ? "Direct swap" : "Route" }}</span>
          <span>{{ state.routeInfo.routeString }}</span>
        </div>
      </div>
    </div>

    <!-- Account Button -->
    <div v-if="isConnected" class="flex justify-center items-center mt-2">
      <appkit-account-button />
    </div>
  </div>
</template>
