import type { InjectionKey } from "vue";
import type { Config } from "@wagmi/core";

/**
 * The slice of the Reown AppKit modal controller the widget actually uses.
 * Typed structurally so the package doesn't hard-depend on AppKit's exported
 * instance type.
 */
export interface AppKitLike {
  // Method syntax (not arrow properties) so the parameter is checked
  // bivariantly  the concrete AppKit's `open` narrows `view` to a literal
  // union, which a strict (contravariant) property check would reject.
  open(options?: { view?: string }): void | Promise<void>;
  close?(): void | Promise<void>;
}

export interface UniswapWidgetContext {
  /** The `@wagmi/core` config from a `WagmiAdapter` (`adapter.wagmiConfig`). */
  wagmiConfig: Config;
  /** The AppKit instance returned by `createAppKit`. */
  appKit: AppKitLike;
}

/** Injection key the `<UniswapProvider>` fills and the composables read. */
export const UNISWAP_WIDGET_KEY: InjectionKey<UniswapWidgetContext> = Symbol(
  "uniswap-widget"
);
