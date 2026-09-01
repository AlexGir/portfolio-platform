# portfolio-platform

Plateforme web personnelle : **portfolio public** + **applications personnelles** accessibles
après authentification.

> Monorepo en cours de construction. Voir [`docs/architecture.md`](docs/architecture.md) et le
> suivi d'avancement dans [`CLAUDE.md`](CLAUDE.md).

## Stack

| Domaine         | Choix                                                           |
| --------------- | --------------------------------------------------------------- |
| Frontend        | Next.js (App Router), React, TypeScript, Tailwind CSS           |
| Backend         | Node.js, Express, REST + GraphQL (Yoga), OAuth2 + JWT           |
| Base de données | PostgreSQL via Prisma                                           |
| Qualité         | Vitest (unit + intégration), Playwright (e2e), ESLint, Prettier |
| Monorepo        | pnpm workspaces + Turborepo                                     |
| Déploiement     | Docker Compose sur VPS (Hostinger), CI/CD GitHub Actions        |

## Prérequis

- Node.js 22+ (`.nvmrc`)
- pnpm 9+ (`corepack enable` ou `npm i -g pnpm`)
- Docker (pour PostgreSQL en local, à partir de la PR #3)

## Démarrage

```bash
pnpm install
pnpm test        # Vitest sur tous les packages
pnpm typecheck
pnpm lint
pnpm build
```

## Structure

```
apps/
  web/          Next.js — site public + dashboard privé      (PR #4)
  api/          Express — REST + GraphQL + OAuth2/JWT + Prisma
packages/
  shared/       types + schémas Zod + constantes partagés
  tsconfig/     configs TypeScript de base
infra/          Docker Compose, Dockerfiles, reverse proxy   (PR #5)
docs/           architecture, déploiement, auth
```

## Scripts

| Commande                                   | Effet                    |
| ------------------------------------------ | ------------------------ |
| `pnpm dev`                                 | Lance les apps en watch  |
| `pnpm test`                                | Tous les tests           |
| `pnpm typecheck`                           | `tsc --noEmit` partout   |
| `pnpm lint`                                | ESLint partout           |
| `pnpm build`                               | Build de production      |
| `pnpm format`                              | Prettier (écriture)      |
| `pnpm --filter @portfolio/shared <script>` | Cibler un seul workspace |
