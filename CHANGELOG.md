# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project follows [Semantic Versioning](https://semver.org/) once it reaches 1.0.

## [Unreleased]

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
