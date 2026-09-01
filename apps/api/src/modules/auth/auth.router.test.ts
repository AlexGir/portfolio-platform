import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { accessTokenResponseSchema, userDtoSchema } from '@portfolio/shared';
import { createTestPrisma, hasTestDatabase, resetDatabase } from '../../test/db.js';
import { createIntegrationApp } from '../../test/app.js';
import { fakeOAuthRegistry } from '../../test/fake-oauth.js';

/** Normalise a `set-cookie` header value (string or array) to a string array. */
function toCookieArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') return [value];
  return [];
}
/** Join `Set-Cookie` entries into a `Cookie` request header. */
function cookieHeader(value: unknown): string {
  return toCookieArray(value)
    .map((c) => c.split(';')[0])
    .join('; ');
}
function readCookie(value: unknown, name: string): string | undefined {
  return toCookieArray(value)
    .find((c) => c.startsWith(`${name}=`))
    ?.split(';')[0];
}

describe.skipIf(!hasTestDatabase)('auth flow (integration)', () => {
  const prisma = createTestPrisma();
  const app = createIntegrationApp({
    prisma,
    oauth: fakeOAuthRegistry({
      github: {
        provider: 'github',
        providerAccountId: 'gh-42',
        email: 'octocat@example.com',
        displayName: 'Octo Cat',
        avatarUrl: null,
      },
    }),
  });

  beforeEach(() => resetDatabase(prisma));
  afterAll(() => prisma.$disconnect());

  async function completeLogin() {
    const start = await request(app).get('/auth/github');
    expect(start.status).toBe(302);
    const state = new URL(String(start.headers.location)).searchParams.get('state');
    expect(state).toBeTruthy();

    const callback = await request(app)
      .get(`/auth/github/callback?code=fake-code&state=${state}`)
      .set('Cookie', cookieHeader(start.headers['set-cookie']));

    expect(callback.status).toBe(302);
    expect(callback.headers.location).toBe('http://localhost:3000/auth/callback');
    const refreshCookie = readCookie(callback.headers['set-cookie'], 'pp_refresh');
    expect(refreshCookie).toBeTruthy();
    return refreshCookie as string;
  }

  it('redirects to the provider with state and PKCE cookies', async () => {
    const res = await request(app).get('/auth/github');
    expect(res.status).toBe(302);
    expect(String(res.headers.location)).toMatch(
      /^https:\/\/provider\.test\/github\/authorize\?state=/,
    );
    const names = cookieHeader(res.headers['set-cookie'])
      .split('; ')
      .map((c) => c.split('=')[0]);
    expect(names).toContain('pp_oauth_state');
    expect(names).toContain('pp_oauth_verifier');
  });

  it('rejects a callback whose state does not match the cookie', async () => {
    const start = await request(app).get('/auth/github');
    const res = await request(app)
      .get('/auth/github/callback?code=fake-code&state=tampered')
      .set('Cookie', cookieHeader(start.headers['set-cookie']));
    expect(res.status).toBe(400);
  });

  it('creates the user on first callback and opens a session', async () => {
    await completeLogin();
    const user = await prisma.user.findUnique({ where: { email: 'octocat@example.com' } });
    expect(user?.displayName).toBe('Octo Cat');
    expect(await prisma.refreshToken.count()).toBe(1);
  });

  it('exchanges the refresh cookie for an access token and rotates it', async () => {
    const refreshCookie = await completeLogin();

    const refreshed = await request(app).post('/auth/refresh').set('Cookie', refreshCookie);
    expect(refreshed.status).toBe(200);
    const body = accessTokenResponseSchema.parse(refreshed.body);
    expect(body.tokenType).toBe('Bearer');

    const rotated = readCookie(refreshed.headers['set-cookie'], 'pp_refresh');
    expect(rotated).toBeTruthy();
    expect(rotated).not.toBe(refreshCookie);

    const me = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${body.accessToken}`);
    expect(me.status).toBe(200);
    expect(userDtoSchema.parse(me.body).email).toBe('octocat@example.com');
  });

  it('rejects reuse of an already-rotated refresh cookie', async () => {
    const refreshCookie = await completeLogin();
    await request(app).post('/auth/refresh').set('Cookie', refreshCookie).expect(200);

    const reused = await request(app).post('/auth/refresh').set('Cookie', refreshCookie);
    expect(reused.status).toBe(401);
  });

  it('logs out (revokes) and then refuses the token', async () => {
    const refreshCookie = await completeLogin();
    await request(app).post('/auth/logout').set('Cookie', refreshCookie).expect(204);

    const afterLogout = await request(app).post('/auth/refresh').set('Cookie', refreshCookie);
    expect(afterLogout.status).toBe(401);
  });

  it('rejects /users/me without a bearer token', async () => {
    const res = await request(app).get('/users/me');
    expect(res.status).toBe(401);
  });
});
