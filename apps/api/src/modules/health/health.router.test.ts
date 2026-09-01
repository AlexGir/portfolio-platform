import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { healthResponseSchema } from '@portfolio/shared';
import { createTestPrisma, hasTestDatabase, resetDatabase } from '../../test/db.js';
import { createIntegrationApp } from '../../test/app.js';

describe.skipIf(!hasTestDatabase)('GET /health (integration)', () => {
  const prisma = createTestPrisma();
  const app = createIntegrationApp({ prisma });

  beforeEach(() => resetDatabase(prisma));
  afterAll(() => prisma.$disconnect());

  it('returns 200 and a valid payload when the database is reachable', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    const body = healthResponseSchema.parse(res.body);
    expect(body.status).toBe('ok');
    expect(body.service).toBe('api');
    expect(body.version).toBe('test');
  });
});
