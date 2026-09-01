import { PrismaClient } from '@prisma/client';

/**
 * Single PrismaClient per process. In dev the module is re-evaluated on every
 * hot reload, so the instance is cached on `globalThis` to avoid exhausting the
 * connection pool.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export type { PrismaClient };
