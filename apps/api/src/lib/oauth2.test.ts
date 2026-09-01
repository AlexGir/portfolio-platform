import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { deriveCodeChallenge, generateCodeVerifier, generateState } from './oauth2.js';

describe('generateState', () => {
  it('produces unique, URL-safe values', () => {
    const a = generateState();
    const b = generateState();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe('generateCodeVerifier / deriveCodeChallenge', () => {
  it('generates a verifier of RFC 7636 length', () => {
    const verifier = generateCodeVerifier();
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier.length).toBeLessThanOrEqual(128);
  });

  it('derives the S256 challenge as base64url(sha256(verifier))', () => {
    const verifier = 'fixed-verifier-value-for-the-test';
    const expected = createHash('sha256').update(verifier).digest('base64url');
    expect(deriveCodeChallenge(verifier)).toBe(expected);
    expect(deriveCodeChallenge(verifier)).not.toContain('=');
  });
});
