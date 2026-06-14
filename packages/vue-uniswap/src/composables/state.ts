import { reactive } from "vue";
import type { TokenInfo } from "@uniswap-widget/core";

/** Reactive swap state  the Vue counterpart of the React `SwapState`. */
export interface WidgetState {
  inputAmount: string;
  outputAmount: string;
  inputToken: TokenInfo | null;
  outputToken: TokenInfo | null;
  loading: boolean;
  error: string | null;
  routeInfo?: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };
}

export function createWidgetState(): WidgetState {
  return reactive<WidgetState>({
    inputAmount: "",
    outputAmount: "",
    inputToken: null,
    outputToken: null,
    loading: false,
    error: null,
    routeInfo: undefined,
  });
}
