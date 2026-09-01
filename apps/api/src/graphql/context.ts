import { BEARER_PREFIX, type AccessTokenPayload } from '@portfolio/shared';
import type { PrismaClient } from '@prisma/client';
import { verifyAccessToken } from '../lib/jwt.js';
import type { HealthChecker, HealthMeta } from '../modules/health/health.service.js';

export interface GraphQLContext {
  user: AccessTokenPayload | null;
  prisma: PrismaClient;
  health: HealthChecker;
  meta: HealthMeta;
}

export interface ContextFactoryDeps {
  prisma: PrismaClient;
  health: HealthChecker;
  meta: HealthMeta;
  accessSecret: string;
}

/**
 * Build a per-request GraphQL context. A missing or invalid bearer token yields
 * `user: null` (unauthenticated) rather than an error — resolvers decide what
 * requires auth.
 */
export function createContextFactory(deps: ContextFactoryDeps) {
  return async (request: Request): Promise<GraphQLContext> => {
    const header = request.headers.get('authorization');
    let user: AccessTokenPayload | null = null;

    if (header?.startsWith(BEARER_PREFIX)) {
      try {
        user = await verifyAccessToken(header.slice(BEARER_PREFIX.length), deps.accessSecret);
      } catch {
        user = null;
      }
    }

    return { user, prisma: deps.prisma, health: deps.health, meta: deps.meta };
  };
}
