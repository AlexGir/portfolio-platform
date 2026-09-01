import { z } from 'zod';

/** OAuth2 identity providers wired into the platform. */
export const oauthProviderSchema = z.enum(['github', 'google']);
export type OAuthProvider = z.infer<typeof oauthProviderSchema>;

/** Authorization level attached to a user and encoded in the access token. */
export const userRoleSchema = z.enum(['user', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Decoded payload of a short-lived access token.
 * `iat` / `exp` are populated by the JWT library and are therefore optional on
 * the input side (e.g. when constructing a payload to sign).
 */
export const accessTokenPayloadSchema = z.object({
  /** User id (JWT subject). */
  sub: z.string().uuid(),
  email: z.string().email(),
  role: userRoleSchema,
  iat: z.number().int().positive().optional(),
  exp: z.number().int().positive().optional(),
});
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

/**
 * Token bundle returned when exchanging an OAuth authorization code or rotating
 * a refresh token. `expiresIn` is the access token TTL in seconds.
 */
export const authTokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().int().positive(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;
