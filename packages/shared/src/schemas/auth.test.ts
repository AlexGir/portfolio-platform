import { describe, expect, it } from 'vitest';
import {
  accessTokenPayloadSchema,
  authTokensSchema,
  oauthProviderSchema,
  userRoleSchema,
} from './auth.js';

describe('oauthProviderSchema', () => {
  it('accepts wired providers', () => {
    expect(oauthProviderSchema.parse('github')).toBe('github');
    expect(oauthProviderSchema.parse('google')).toBe('google');
  });

  it('rejects providers that are not wired', () => {
    expect(oauthProviderSchema.safeParse('facebook').success).toBe(false);
  });
});

describe('accessTokenPayloadSchema', () => {
  const base = {
    sub: '3f1e7a4c-2b6d-4c8e-9a1f-0d5b7c9e2a11',
    email: 'alex@example.com',
    role: 'user',
  };

  it('parses a payload without iat/exp (signing side)', () => {
    const parsed = accessTokenPayloadSchema.parse(base);
    expect(parsed.sub).toBe(base.sub);
    expect(parsed.iat).toBeUndefined();
  });

  it('parses a payload with iat/exp (verifying side)', () => {
    const parsed = accessTokenPayloadSchema.parse({
      ...base,
      iat: 1_700_000_000,
      exp: 1_700_000_900,
    });
    expect(parsed.exp).toBe(1_700_000_900);
  });

  it('rejects a non-uuid subject', () => {
    expect(accessTokenPayloadSchema.safeParse({ ...base, sub: 'not-a-uuid' }).success).toBe(false);
  });

  it('rejects an unknown role', () => {
    expect(accessTokenPayloadSchema.safeParse({ ...base, role: 'superadmin' }).success).toBe(false);
  });
});

describe('authTokensSchema', () => {
  const valid = {
    accessToken: 'header.payload.signature',
    refreshToken: 'opaque-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 900,
  };

  it('parses a well-formed token bundle', () => {
    expect(authTokensSchema.parse(valid)).toEqual(valid);
  });

  it('rejects a token type other than Bearer', () => {
    expect(authTokensSchema.safeParse({ ...valid, tokenType: 'Basic' }).success).toBe(false);
  });

  it('rejects a non-positive expiry', () => {
    expect(authTokensSchema.safeParse({ ...valid, expiresIn: 0 }).success).toBe(false);
  });
});

describe('userRoleSchema', () => {
  it('exposes user and admin', () => {
    expect(userRoleSchema.options).toEqual(['user', 'admin']);
  });
});
