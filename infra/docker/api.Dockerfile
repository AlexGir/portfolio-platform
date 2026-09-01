# syntax=docker/dockerfile:1
# Build context is the repo root: docker build -f infra/docker/api.Dockerfile .

FROM node:22-alpine AS base
RUN corepack enable

# ---- Prune the monorepo down to @portfolio/api's dependency graph ----------
FROM base AS pruner
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY . .
RUN npx turbo prune @portfolio/api --docker

# ---- Install deps and build --------------------------------------------------
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
# Includes `prisma generate` (see turbo.json: build depends on db:generate).
RUN pnpm turbo run build --filter=@portfolio/api

# ---- Runtime image ------------------------------------------------------------
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 apiuser

COPY --from=installer --chown=apiuser:nodejs /app .

USER apiuser
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]
