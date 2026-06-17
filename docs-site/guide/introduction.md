# Introduction

**uniswap-widget** lets you embed Uniswap swap functionality into a dApp — with no token
limitations, no warnings, and no added fee. It ships as a small family of packages: a
framework-agnostic core plus thin React and Vue bindings.

## The packages

| Package | Install | What it is |
|---------|---------|------------|
| [`@uniswap-widget/react`](/packages/react) | `@uniswap-widget/react` | React component + hooks. **Start here for React.** |
| [`@uniswap-widget/vue`](/packages/vue) | `@uniswap-widget/vue` | Vue 3 component + composables. |
| [`@uniswap-widget/core`](/packages/core) | `@uniswap-widget/core` | Framework-agnostic trading logic, types, and themes. |

The React and Vue widgets are thin UI layers over the **core**, so "get a quote", "run a swap",
and "search tokens" have exactly one implementation. You normally install only the React **or** Vue
package — the core comes along as a dependency.

## How it fits into your app

The widget makes three assumptions about the host app. The React example app
([`examples/basic`](https://github.com/houtan-rocky/uniswap-widget/tree/main/examples/basic)) is the
reference implementation of all three:

1. **Tailwind CSS** — the widget ships no CSS of its own; your Tailwind build generates its classes
   (add the package to your `content` globs).
2. **An API proxy** — the widget calls relative paths (`/api/base-rpc`, and optionally a token-search
   path) that your app proxies to Base RPC and Uniswap's gateway.
3. **A Vite-style env** — configuration is read from `import.meta.env.VITE_*`.

Each package page documents these in full. See the
[React host-app requirements](/packages/react#host-app-requirements) for the canonical write-up.

## Wallet support

The widget is **wallet-agnostic**: it reads the connected account and an `ethers` signer from a small
adapter, so [Reown AppKit](https://reown.com/) is just the zero-config default. You can plug in any
wallet library — or use the built-in injected (`window.ethereum`) adapter with no Reown/wagmi at all.
See [Wallet adapters](/packages/react#wallet-adapters-plugin).

## Next steps

- **[Getting started](/guide/getting-started)** — install and render a widget in a few minutes.
- **[Packages](/packages/react)** — the complete API reference for each package.
- **[Playground](/playground/)** — runnable React and Vue example apps.
