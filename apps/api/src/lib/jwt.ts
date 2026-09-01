import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';
import { accessTokenPayloadSchema, type AccessTokenPayload } from '@portfolio/shared';
import { unauthorized } from './http-error.js';

const ALG = 'HS256';

function key(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/** Claims we control when minting an access token (before `iat`/`exp` are added). */
export type AccessTokenClaims = Pick<AccessTokenPayload, 'sub' | 'email' | 'role'>;

export interface SignedAccessToken {
  token: string;
  /** Lifetime in seconds, mirrors the `exp - iat` delta. */
  expiresIn: number;
}

/**
 * Mint a short-lived HS256 access token.
 * @param ttlSeconds lifetime; also returned as `expiresIn` for the client
 */
export async function signAccessToken(
  claims: AccessTokenClaims,
  secret: string,
  ttlSeconds: number,
): Promise<SignedAccessToken> {
  const token = await new SignJWT({ email: claims.email, role: claims.role })
    .setProtectedHeader({ alg: ALG })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key(secret));

  return { token, expiresIn: ttlSeconds };
}

/**
 * Verify an access token's signature and expiry, then validate its shape.
 * @throws {HttpError} 401 for any invalid, expired or malformed token
 */
export async function verifyAccessToken(
  token: string,
  secret: string,
): Promise<AccessTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: [ALG] });
    return accessTokenPayloadSchema.parse(payload);
  } catch (error) {
    if (error instanceof joseErrors.JWTExpired) {
      throw unauthorized('Access token expired');
    }
    throw unauthorized('Invalid access token');
  }
}
