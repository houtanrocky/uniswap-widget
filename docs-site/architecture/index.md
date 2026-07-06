---
title: Uniswap Widget Architecture
description: Explore the TypeScript architecture behind the framework-agnostic Uniswap trading core and its React and Vue swap widget bindings.
---

# Uniswap Widget Architecture

The design of the monorepo is recorded as short **Architecture Decision Records** (ADRs) in
[`/docs`](https://github.com/houtanrocky/uniswap-widget/tree/main/docs). Each is a dated
Status / Context / Decision / Consequences note.

## The shape, in one paragraph

A framework-agnostic **core** ([`@uniswap-widget/core`](/packages/core)) owns all trading logic —
quotes, swaps, token search, the RPC layer, types, and themes. The **React**
([`@uniswap-widget/react`](/packages/react)) and **Vue** ([`@uniswap-widget/vue`](/packages/vue))
packages are thin UI bindings whose hooks/composables wrap the core, so there is exactly one
implementation of the trading behaviour. Dependency versions are kept aligned across packages through
**pnpm catalogs** in
[`pnpm-workspace.yaml`](https://github.com/houtanrocky/uniswap-widget/blob/main/pnpm-workspace.yaml).

## Decision records

| # | Record | Status |
|---|--------|--------|
| [0001](https://github.com/houtanrocky/uniswap-widget/blob/main/docs/0001-monorepo-architecture.md) | Monorepo architecture | Accepted |
| [0002](https://github.com/houtanrocky/uniswap-widget/blob/main/docs/0002-package-boundaries.md) | Package boundaries & public API | Accepted |
| [0003](https://github.com/houtanrocky/uniswap-widget/blob/main/docs/0003-dependency-and-catalog-strategy.md) | Dependency & catalog strategy | Accepted |
| [0004](https://github.com/houtanrocky/uniswap-widget/blob/main/docs/0004-core-deps-decoupling.md) | Core ↔ external-deps decoupling | Proposed |

::: info Historical note
ADRs 0001–0004 are dated records of the original single-package → monorepo work (when the widget was
published as `react-uniswap`) and the *proposed* core decoupling. The core/React/Vue split has since
shipped under the `@uniswap-widget/*` names; those historical references are left as-is.
:::
