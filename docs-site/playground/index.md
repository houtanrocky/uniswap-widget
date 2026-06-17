# Playground — example apps

The repo ships two small, runnable apps that consume the published widget exactly the way a real
downstream app would (via `workspace:*`, importing from the package's public entry point). They double
as the **reference implementation of the host-app contract** — Tailwind, the API proxy, and the Vite
env are all wired up for you.

| Example | Framework | Package it uses | What it shows |
|---------|-----------|-----------------|---------------|
| [`examples/basic`](https://github.com/houtan-rocky/uniswap-widget/tree/main/examples/basic) | React | [`@uniswap-widget/react`](/packages/react) | Tailwind config, dev proxy + Vercel functions, Reown wallet wiring |
| [`examples/vue`](https://github.com/houtan-rocky/uniswap-widget/tree/main/examples/vue) | Vue 3 | [`@uniswap-widget/vue`](/packages/vue) | The Vue counterpart, proving the shared core drives both |

::: info Why there's no live demo embedded here
A real swap needs a connected wallet **and** a backend proxy for `/api/base-rpc` and the token-search
gateway. GitHub Pages is static and can't host that proxy, so the playground is meant to be **run
locally** (or deployed to a host like Vercel, which the examples are set up for).
:::

## Run it locally

```bash
git clone https://github.com/houtan-rocky/uniswap-widget.git
cd uniswap-widget

# Node + Corepack (pins pnpm via the "packageManager" field)
corepack enable pnpm
pnpm install

pnpm dev        # React  → examples/basic
pnpm dev:vue    # Vue    → examples/vue
```

Then open the printed local URL.

## Configure

Each example reads its keys from a local `.env`:

```bash
cp examples/basic/.env.example examples/basic/.env
# (or examples/vue/.env.example for the Vue app)
```

| Variable | Used by | Purpose |
|----------|---------|---------|
| `VITE_REOWN_PROJECT_ID` | the app | WalletConnect / Reown AppKit project id |
| `VITE_UNISWAP_API_KEY` | `vite.config.ts` proxy | Auth header for the Uniswap gateway in dev |
| `UNISWAP_API_KEY` | `api/*.js` | Auth header for the Vercel functions in production |

## How each example satisfies the contract

| Requirement | Where it lives |
|-------------|----------------|
| **Tailwind** generating the widget's classes | `tailwind.config.js` scans the widget's `src` |
| **`/api/base-rpc`** + token-search proxy (dev) | `vite.config.ts` → `server.proxy` |
| Same paths in production | `api/` Vercel functions + `vercel.json` rewrites |
| Vite `import.meta.env.VITE_*` | it's a Vite app; values come from `.env` |

See the [React host-app requirements](/packages/react#host-app-requirements) for the contract these
examples implement.
