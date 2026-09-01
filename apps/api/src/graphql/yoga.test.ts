import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestPrisma, hasTestDatabase, resetDatabase } from '../test/db.js';
import { createIntegrationApp, testConfig } from '../test/app.js';
import { signAccessToken } from '../lib/jwt.js';

describe.skipIf(!hasTestDatabase)('GraphQL (integration)', () => {
  const prisma = createTestPrisma();
  const app = createIntegrationApp({ prisma });
  const accessSecret = testConfig().JWT_ACCESS_SECRET;

  beforeEach(() => resetDatabase(prisma));
  afterAll(() => prisma.$disconnect());

  const query = (body: object, token?: string) => {
    const req = request(app).post('/graphql').set('Content-Type', 'application/json');
    if (token) req.set('Authorization', `Bearer ${token}`);
    return req.send(JSON.stringify(body));
  };

  it('answers the health query', async () => {
    const res = await query({ query: '{ health { status service } }' });
    expect(res.status).toBe(200);
    expect(res.body.data.health).toMatchObject({ status: 'ok', service: 'api' });
  });

  it('returns null for me without a token', async () => {
    const res = await query({ query: '{ me { id } }' });
    expect(res.status).toBe(200);
    expect(res.body.data.me).toBeNull();
  });

  it('returns the user for me with a valid token', async () => {
    const user = await prisma.user.create({
      data: { email: 'gql@example.com', displayName: 'GQL User' },
    });
    const { token } = await signAccessToken(
      { sub: user.id, email: user.email, role: user.role },
      accessSecret,
      900,
    );

    const res = await query({ query: '{ me { id email displayName } }' }, token);
    expect(res.status).toBe(200);
    expect(res.body.data.me).toMatchObject({
      id: user.id,
      email: 'gql@example.com',
      displayName: 'GQL User',
    });
  });
});
