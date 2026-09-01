import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Idempotent seed: ensures one admin user exists. Override the address with
 * `SEED_ADMIN_EMAIL`. OAuth accounts are still created on first real login.
 */
async function main(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'admin' },
    create: { email, displayName: 'Platform Admin', role: 'admin' },
  });

  console.log(`Seeded admin user ${user.email} (${user.id})`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
