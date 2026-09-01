# Architecture

## Vue d'ensemble

Plateforme personnelle en deux parties :

1. **Portfolio public** — site vitrine (profil, projets, contact).
2. **Applications personnelles** — outils privés accessibles après authentification OAuth2,
   pour moi et un petit nombre de comptes autorisés.

Le tout vit dans un **monorepo** pour partager le typage entre le front et le back, garder une
CI unique et versionner l'infrastructure avec le code.

## Structure

```
portfolio-platform/
├─ apps/
│  ├─ web/            Next.js (App Router) · React · Tailwind
│  └─ api/            Express · REST + GraphQL · Prisma · PostgreSQL
├─ packages/
│  ├─ shared/         types + schémas Zod + constantes (framework-agnostique)
│  └─ tsconfig/       configs TypeScript de base
├─ infra/             Docker Compose, Dockerfiles, reverse proxy
├─ docs/              cette documentation
└─ .github/workflows/ CI (+ déploiement à partir de la PR #5)
```

### Règles de dépendance

- `apps/*` peuvent dépendre de `packages/*`. L'inverse est interdit.
- `apps/web` et `apps/api` ne s'importent **jamais** l'un l'autre. Ils communiquent par HTTP ;
  le contrat est exprimé par les schémas de `packages/shared`.
- `packages/shared` n'importe aucun framework (ni React, ni Express) : il doit rester
  utilisable des deux côtés et dans un worker.

## Choix techniques et compromis

| Choix                                                           | Raison                                                                                                   | Compromis assumé                                                                |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Monorepo pnpm + Turborepo**                                   | Typage partagé, CI unique, cache de tâches                                                               | Outillage initial plus lourd qu'un simple repo                                  |
| **API Express séparée** (plutôt que les route handlers Next.js) | Frontière front/back nette ; met en valeur le back (REST + GraphQL + OAuth2) ; déployable indépendamment | Deux services à faire tourner et à déployer, CORS à gérer                       |
| **REST + GraphQL**                                              | REST pour l'auth et les webhooks, GraphQL pour les besoins de lecture riches du dashboard                | Deux surfaces d'API à documenter et tester                                      |
| **Prisma**                                                      | Migrations, client typé, seed et mocks simples                                                           | Runtime plus lourd qu'un query builder ; `prisma generate` dans la CI           |
| **OAuth2 + JWT custom** (côté Express)                          | Démontre la maîtrise du flux ; pas de dépendance à un service d'auth                                     | Code sensible à tester rigoureusement (rotation des refresh tokens, révocation) |
| **Zod aux frontières**                                          | Une seule source de vérité pour les types runtime + statique                                             | Léger coût de parsing sur le chemin chaud                                       |

## Authentification (aperçu — détaillé en PR #3)

- Flux **Authorization Code** avec GitHub et Google.
- L'API émet un **access token JWT** court (15 min) + un **refresh token opaque** stocké en
  base (table `RefreshToken`, rotation à chaque usage, révocable).
- Le web garde le refresh token dans un cookie `HttpOnly` `SameSite=Lax` ; l'access token
  reste en mémoire.
- Les routes protégées de l'API vérifient l'access token via un middleware ; le dashboard
  Next.js vérifie la session côté serveur avant rendu.

## Déploiement (aperçu — détaillé en PR #5)

- Cible : **VPS Hostinger**, Docker Compose (`web`, `api`, `postgres`, reverse proxy `caddy`
  avec TLS automatique).
- CI GitHub Actions : `typecheck → lint → test → build`. Sur `main` et après CI verte, un
  workflow de déploiement se connecte en SSH, récupère l'image / le code, applique les
  migrations Prisma et redémarre la stack.

## Feuille de route

| PR  | Contenu                                                                                          |
| --- | ------------------------------------------------------------------------------------------------ |
| #2  | Skeleton monorepo, `packages/shared`, tooling, CI                                                |
| #3  | `apps/api` : Express, Prisma, modules health / users / auth, REST + GraphQL, tests d'intégration |
| #4  | `apps/web` : portfolio, dashboard protégé, login OAuth, tests composants + e2e                   |
| #5  | `infra/` : Docker Compose prod, déploiement Hostinger                                            |
