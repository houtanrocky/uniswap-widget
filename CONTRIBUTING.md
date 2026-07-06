# Contributing

## Before opening a change

- Search existing issues and pull requests first.
- Use a security advisory, not a public issue, for vulnerabilities; see [SECURITY.md](SECURITY.md).
- Keep changes focused and add or update tests for behavior changes.

## Local setup

```bash
corepack enable pnpm
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build:all
pnpm docs:build
```

Use `pnpm dev` for the React example and `pnpm dev:vue` for the Vue example. Copy the relevant
`.env.example` file for local credentials; never commit secrets.

## Pull requests

Explain the problem, the chosen approach, testing performed, and any breaking or security-relevant
effects. Update package documentation when a public API changes. By contributing, you agree that
your contribution is licensed under this repository's MIT License.
