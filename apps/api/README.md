# @portfolio/api

Express API for the platform: REST + GraphQL, OAuth2/JWT authentication,
Prisma/PostgreSQL.

## Layout

```
src/
  app.ts              createApp(deps) — Express app, no listen (testable)
  index.ts            wires real deps + listen + graceful shutdown
  config/env.ts       Zod-validated environment
  lib/                jwt (jose), refresh-token hashing, logger (pino), HttpError
  middleware/         authenticate (Bearer), error handler, not-found
  modules/
    health/           GET /health  (200 ok / 503 degraded)
    auth/             OAuth2 code flow + JWT sessions
      providers/      GitHub & Google adapters (dependency-free) + pure mappers
    users/            GET /users/me  (protected)
  graphql/            Yoga handler, schema, resolvers, context
  test/               integration harness (throwaway Postgres, fake OAuth)
prisma/
  schema.prisma       User, OAuthAccount, RefreshToken
  migrations/         SQL migrations (applied with `db:migrate:deploy`)
  seed.ts             idempotent admin seed
```

## Auth model

- `GET /auth/:provider` → sets signed `state` + PKCE cookies, redirects to the provider.
- `GET /auth/:provider/callback` → verifies `state`, exchanges the code, upserts the
  user, sets an `HttpOnly` `pp_refresh` cookie, redirects to `WEB_ORIGIN/auth/callback`.
- `POST /auth/refresh` → rotates the refresh token, returns a new access token (JSON).
  Reusing a rotated token revokes the whole token family.
- `POST /auth/logout` → revokes the refresh token, clears the cookie.

Access tokens are HS256 JWTs (15 min). Refresh tokens are opaque, stored only as a
SHA-256 hash, valid 30 days, single-use.

## Local development

```bash
# 1. Start Postgres (see infra/compose.dev.yaml)
docker compose -f ../../infra/compose.dev.yaml up -d

# 2. From the repo root, with .env filled in:
pnpm --filter @portfolio/api db:migrate      # create/apply migrations
pnpm --filter @portfolio/api db:seed
pnpm --filter @portfolio/api dev
```

## Tests

- **Unit** (no database): config, jwt, refresh-token, provider mappers, health,
  `AuthService` (in-memory repository). Always run.
- **Integration** (`src/**/*.test.ts` using `src/test/`): real Express app via
  `supertest`, throwaway Postgres, fake OAuth registry. Run only when
  `DATABASE_URL` is set (CI provides a `postgres` service).

```bash
pnpm --filter @portfolio/api test
```
