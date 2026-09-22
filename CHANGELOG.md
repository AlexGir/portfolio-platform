# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project follows [Semantic Versioning](https://semver.org/) once it reaches 1.0.

## [Unreleased]

### Changed — Infra: integrate with the VPS's existing Traefik

- The Hostinger VPS already runs a shared Traefik instance for other Docker
  projects (`network_mode: host`, labels-based discovery, `letsencrypt` cert
  resolver on port 80/443) — discovered when `caddy` failed to bind port 80
  during the first real deploy.
- Removed the `caddy` service and `infra/Caddyfile` from
  `infra/compose.prod.yaml`; `web` and `api` now carry Traefik labels
  (`traefik.enable`, host rule, `websecure` entrypoint, `letsencrypt`
  certresolver) instead, the same pattern already used by the VPS's other
  services. No new Docker network needed — a host-networked Traefik can reach
  any container's bridge-network IP directly.
- `docs/deployment.md` updated to describe the Traefik integration instead of
  a dedicated reverse proxy.
- Also made the GitHub repository **public** (was private) so the VPS can
  `git clone`/`git pull` over HTTPS without a token or deploy key — verified
  no secrets are or were ever committed (`.env` always git-ignored).

### Added — Editorial redesign & case studies (`apps/web`) · PR #6

- Visual identity overhaul inspired by editorial product-design portfolios
  (rebon.studio, adamhickey.com): warm paper palette, a Fraunces/Inter display
  and body font pairing, generated SVG "cover art" per project (no stock
  imagery needed), grain texture, pure-CSS entrance animation.
- New case study content model (`content/case-studies.ts`) replacing the flat
  `projects.ts`: problem/solution overview, methods, a numbered narrative with
  optional callouts, a reflection pull-quote, and an impact metrics grid. Ships
  with 3 illustrative (fictional) product-design case studies to replace with
  real work later.
- New routes: `/work` (full index) and `/work/[slug]` (case study template) —
  `generateStaticParams`, proper `notFound()` on an unknown slug, prev/next
  project navigation.
- Homepage hero, work section, header nav (fixed cross-page anchors) and
  section primitives (`eyebrow` support) restyled to match.
- Tests: 8 new unit test files for the case-study content and components;
  new `e2e/work.spec.ts` (index, card → case study, prev/next nav, 404).
- **Removed** the `motion` (Framer Motion) dependency after finding its
  mount-triggered animations could get stuck at `opacity: 0` on both
  `next dev` and a real `next start` — root-caused as unrelated to the
  library itself (confirmed the same page renders correctly once the browser
  tab is actually focused/foregrounded) but replaced anyway with a small
  pure-CSS `@keyframes` utility: strictly more robust for zero visual cost,
  since it cannot depend on any JS/hydration timing.

### Added — Infra & deployment (`infra/`) · PR #5

- Production Docker Compose (`infra/compose.prod.yaml`): `caddy` (reverse proxy
  - automatic TLS), `web`, `api`, `postgres` on one VPS.
- Multi-stage Dockerfiles for `api` and `web` using `turbo prune` (Alpine,
  non-root users; web ships Next's `standalone` output).
- `infra/Caddyfile` for `alexandregiraud.tech` (+ `www`) and
  `api.alexandregiraud.tech`, with automatic Let's Encrypt certificates.
- CI: `docker-build` job actually builds both images on every PR; `deploy` job
  (SSH, gated behind the `DEPLOY_ENABLED` repo variable and 3 secrets) rolls
  the VPS forward and runs `prisma migrate deploy` after `verify` + `e2e` +
  `docker-build` are green on `main`.
- `docs/deployment.md` — full Hostinger runbook (VPS setup, DNS, first deploy,
  secrets, backups).
- Prisma: added the `linux-musl-openssl-3.0.x` binary target for Alpine.

### Added — Web (`apps/web`) · PR #4

- Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- Public portfolio: hero, about, expertise, work (projects), contact — content
  lives in `src/content/*.ts`, edited independently of the UI.
- Dark mode: pre-paint class script (no flash) + a persisted manual toggle.
- Auth pages: `/login` (provider buttons → API), `/auth/callback` (exchanges
  the refresh cookie for a session), `/dashboard` (client-guarded, empty state
  for future personal apps).
- `AuthProvider` — silent session restore on load, in-memory access token.
- Accessibility: skip link, landmarks, labelled nav, focus-visible ring,
  `prefers-reduced-motion` handling, `eslint-plugin-jsx-a11y`.
- Tests: 15 unit tests (Vitest + Testing Library — content integrity, API
  client, section rendering, theme toggle) and 7 Playwright e2e specs (landing
  sections, CTA scroll, theme toggle, a11y landmarks, login links, dashboard
  redirect) — both run locally and in CI.
- CI: new `e2e` job (installs Chromium, builds + starts the app, runs Playwright).

### Added — API (`apps/api`) · PR #3

- Express application factory (`createApp`) with a separate `listen` entrypoint and
  graceful shutdown.
- Zod-validated environment configuration; the process refuses to start when a
  required variable is missing.
- Prisma schema and initial migration: `User`, `OAuthAccount`, `RefreshToken`
  (refresh tokens stored as SHA-256 hashes, single-use with rotation and reuse
  detection). Idempotent admin seed.
- Custom OAuth2 Authorization Code flow (dependency-free) for **GitHub** and
  **Google** (PKCE S256 for Google), behind a provider adapter interface.
- JWT access tokens (HS256, 15 min) via `jose`; `authenticate` middleware for
  protected routes.
- REST endpoints: `GET /health` (200 / 503), `GET /auth/:provider`,
  `GET /auth/:provider/callback`, `POST /auth/refresh`, `POST /auth/logout`,
  `GET /users/me`.
- GraphQL endpoint (`/graphql`, GraphQL Yoga) with `health` and `me` queries.
- Security middleware: `helmet`, strict CORS, rate limiting on `/auth`,
  `pino` request logging, uniform JSON error envelope.
- Tests: 44 unit tests (config, JWT, OAuth2 helpers, provider mappers, health,
  `AuthService` state machine via an in-memory repository) plus integration
  specs (`supertest` + throwaway PostgreSQL + fake OAuth registry) exercised in CI.

### Added — shared (`packages/shared`)

- `accessTokenResponseSchema` — refresh response body (no refresh token in JSON).

### Changed — CI

- CI now provisions a `postgres:16` service, generates the Prisma client and
  applies migrations before typecheck / lint / test / build.

## [0.1.0] — 2026-09-01 · PR #2

### Added

- pnpm + Turborepo monorepo skeleton (`apps/*`, `packages/*`), Node 22, strict
  TypeScript base configs.
- `packages/shared`: Zod schemas and types for `health`, `auth`, `user` + shared
  constants, with 20 unit tests.
- Tooling: ESLint (flat) + Prettier + EditorConfig + `.gitattributes`.
- GitHub Actions CI: format check, typecheck, lint, test, build.
- `CLAUDE.md`, `docs/architecture.md`, `.env.example`.

### Removed

- `greet.*` practice files.
