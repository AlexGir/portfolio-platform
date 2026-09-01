import { describe, expect, it } from 'vitest';
import { SignJWT } from 'jose';
import { HttpError } from './http-error.js';
import { signAccessToken, verifyAccessToken } from './jwt.js';

const SECRET = 'unit-test-secret-at-least-16-chars';
const claims = {
  sub: '3f1e7a4c-2b6d-4c8e-9a1f-0d5b7c9e2a11',
  email: 'alex@example.com',
  role: 'admin' as const,
};

describe('signAccessToken / verifyAccessToken', () => {
  it('round-trips the claims and reports the TTL', async () => {
    const { token, expiresIn } = await signAccessToken(claims, SECRET, 900);
    expect(expiresIn).toBe(900);

    const payload = await verifyAccessToken(token, SECRET);
    expect(payload.sub).toBe(claims.sub);
    expect(payload.email).toBe(claims.email);
    expect(payload.role).toBe('admin');
    expect(payload.exp).toBeGreaterThan(payload.iat ?? 0);
  });

  it('rejects a token signed with a different secret', async () => {
    const { token } = await signAccessToken(claims, SECRET, 900);
    await expect(
      verifyAccessToken(token, 'another-secret-at-least-16-chars'),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it('rejects an expired token with a specific message', async () => {
    const expired = await new SignJWT({ email: claims.email, role: claims.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(claims.sub)
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 1800)
      .sign(new TextEncoder().encode(SECRET));

    await expect(verifyAccessToken(expired, SECRET)).rejects.toMatchObject({
      status: 401,
      message: 'Access token expired',
    });
  });

  it('rejects a token whose payload does not match the schema', async () => {
    const bad = await new SignJWT({ email: 'not-an-email', role: 'root' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('not-a-uuid')
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(new TextEncoder().encode(SECRET));

    await expect(verifyAccessToken(bad, SECRET)).rejects.toBeInstanceOf(HttpError);
  });
});
