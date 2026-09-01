# syntax=docker/dockerfile:1
# Build context is the repo root: docker build -f infra/docker/web.Dockerfile .

FROM node:22-alpine AS base
RUN corepack enable

# ---- Prune the monorepo down to @portfolio/web's dependency graph ----------
FROM base AS pruner
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY . .
RUN npx turbo prune @portfolio/web --docker

# ---- Install deps and build --------------------------------------------------
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .

# Inlined into the client bundle at build time — safe to bake in, it is not a secret.
ARG NEXT_PUBLIC_API_URL=https://api.alexandregiraud.tech
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm turbo run build --filter=@portfolio/web

# ---- Runtime image (Next.js standalone output) -------------------------------
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 webuser

# `output: 'standalone'` (next.config.ts) produces a self-contained server that
# mirrors the monorepo layout under .next/standalone.
COPY --from=installer --chown=webuser:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=webuser:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=webuser:nodejs /app/apps/web/public ./apps/web/public

USER webuser
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
