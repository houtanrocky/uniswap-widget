# uniswap-widget (monorepo)

[![@uniswap-widget/react](https://img.shields.io/npm/v/@uniswap-widget/react.svg?label=%40uniswap-widget%2Freact)](https://www.npmjs.com/package/@uniswap-widget/react)
[![@uniswap-widget/vue](https://img.shields.io/npm/v/@uniswap-widget/vue.svg?label=%40uniswap-widget%2Fvue)](https://www.npmjs.com/package/@uniswap-widget/vue)
[![@uniswap-widget/core](https://img.shields.io/npm/v/@uniswap-widget/core.svg?label=%40uniswap-widget%2Fcore)](https://www.npmjs.com/package/@uniswap-widget/core)
[![license](https://img.shields.io/npm/l/@uniswap-widget/react.svg)](LICENSE)

A pnpm monorepo for the **`@uniswap-widget`** swap widget  a framework-agnostic
core with React and Vue bindings  and runnable examples.

The widget lets you embed Uniswap swap functionality into a dApp with no token
limitations, no warnings, and no added fee.

📚 **Documentation:** <https://houtanrocky.github.io/uniswap-widget/>

## Layout

```
packages/
  core/              # @uniswap-widget/core   framework-agnostic trading logic, types, themes
  react-uniswap/     # @uniswap-widget/react  React binding (SwapWidget + hooks)
  vue-uniswap/       # @uniswap-widget/vue    Vue 3 binding (SwapWidget + composables)
examples/
  basic/             # React app consuming @uniswap-widget/react (workspace:*)
  vue/               # Vue app consuming @uniswap-widget/vue (workspace:*)
docs/                # architecture & design decision records
```

## Quick start

```bash
# Node + Corepack (pins pnpm via the "packageManager" field)
corepack enable pnpm

pnpm install         # install & link every workspace package
pnpm dev             # run examples/basic (React, Vite dev server)
pnpm dev:vue         # run examples/vue   (Vue,   Vite dev server)
```

Then copy an example's env file and add your keys:

```bash
cp examples/basic/.env.example examples/basic/.env
```

## Common commands (run at the root)

| Command | Effect |
|---------|--------|
| `pnpm dev` / `pnpm dev:vue` | Run the React / Vue example dev server |
| `pnpm build` | Build the React widget (`@uniswap-widget/react`) |
| `pnpm build:all` | Build every package |
| `pnpm typecheck` | Typecheck across packages |
| `pnpm test` | Run the Vitest specs across packages |
| `pnpm lint` | ESLint across the repo |

## Packages

| Package | Path | Description |
|---------|------|-------------|
| [`@uniswap-widget/core`](packages/core/README.md) | `packages/core` | Framework-agnostic trading logic, types, and themes. |
| [`@uniswap-widget/react`](packages/react-uniswap/README.md) | `packages/react-uniswap` | React binding. **Start here for React usage & API docs.** |
| [`@uniswap-widget/vue`](packages/vue-uniswap/README.md) | `packages/vue-uniswap` | Vue 3 binding. |

## Examples

| Example | Path | Description |
|---------|------|-------------|
| [`@examples/basic`](examples/basic/README.md) | `examples/basic` | React consumer app; the reference for the widget's host-app contract (Tailwind + API proxy + env). |
| [`@examples/vue`](examples/vue/README.md) | `examples/vue` | Vue consumer app; the Vue counterpart of the React example. |

## Version management

Dependency versions live in **pnpm catalogs** in
[`pnpm-workspace.yaml`](pnpm-workspace.yaml)  a default catalog for build/lint
tooling and named catalogs `react18`, `vue`, `web3`, `uniswap`. Packages
reference them with the `catalog:` protocol. See
[docs/0003](docs/0003-dependency-and-catalog-strategy.md).

## Design docs

See [`docs/`](docs/README.md) for the architecture decision records. Note: ADRs
0001–0004 are dated records of the original single-package → monorepo work and
the *proposed* core decoupling; the core/React/Vue split has since shipped under
the `@uniswap-widget/*` names.

## License

MIT
