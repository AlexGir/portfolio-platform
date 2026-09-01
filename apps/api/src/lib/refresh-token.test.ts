import { describe, expect, it } from 'vitest';
import { generateRefreshToken, hashRefreshToken } from './refresh-token.js';

describe('refresh token helpers', () => {
  it('generates unique, URL-safe, high-entropy tokens', () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(a.length).toBeGreaterThanOrEqual(43); // 32 bytes base64url
  });

  it('hashes deterministically to 64 hex chars', () => {
    const token = generateRefreshToken();
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    expect(hashRefreshToken(token)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces different hashes for different tokens', () => {
    expect(hashRefreshToken('a')).not.toBe(hashRefreshToken('b'));
  });
});
