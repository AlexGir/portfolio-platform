import { PrismaClient } from '@prisma/client';

/** Integration specs run only when a throwaway Postgres is configured. */
export const hasTestDatabase = Boolean(process.env.DATABASE_URL);

/** A dedicated client per test file; the caller disconnects it in `afterAll`. */
export function createTestPrisma(): PrismaClient {
  return new PrismaClient();
}

/** Wipe every table between tests. Order does not matter thanks to CASCADE. */
export async function resetDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "refresh_tokens", "oauth_accounts", "users" RESTART IDENTITY CASCADE',
  );
}
