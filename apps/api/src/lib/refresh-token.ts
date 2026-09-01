import { createHash, randomBytes } from 'node:crypto';

/**
 * Refresh tokens are opaque random strings. Only their SHA-256 hash is stored,
 * so a database leak does not expose usable tokens.
 */
export function generateRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
