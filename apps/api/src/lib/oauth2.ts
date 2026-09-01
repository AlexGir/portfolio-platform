import { createHash, randomBytes } from 'node:crypto';
import { badRequest } from './http-error.js';

/**
 * Minimal OAuth2 Authorization Code helpers. Kept dependency-free on purpose:
 * the flow is short and this is a place the codebase is meant to show its work.
 */

/** Opaque anti-CSRF value tying an authorize request to its callback. */
export function generateState(): string {
  return randomBytes(32).toString('base64url');
}

/** PKCE code verifier (RFC 7636): 43–128 chars of unreserved characters. */
export function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

/** S256 PKCE challenge for a given verifier. */
export function deriveCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
}

export interface ExchangeCodeInput {
  tokenEndpoint: string;
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
  /** Present for providers that require PKCE (e.g. Google). */
  codeVerifier?: string;
}

/**
 * Exchange an authorization `code` for an access token at the provider's token
 * endpoint. Requests JSON explicitly (GitHub otherwise replies form-encoded).
 */
export async function exchangeCodeForToken(input: ExchangeCodeInput): Promise<OAuth2TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: input.clientId,
    client_secret: input.clientSecret,
    code: input.code,
    redirect_uri: input.redirectUri,
  });
  if (input.codeVerifier) body.set('code_verifier', input.codeVerifier);

  const res = await fetch(input.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  const json = (await res.json().catch(() => null)) as
    (OAuth2TokenResponse & { error?: string; error_description?: string }) | null;

  if (!res.ok || !json || json.error || !json.access_token) {
    const reason = json?.error_description ?? json?.error ?? `HTTP ${res.status}`;
    throw badRequest(`OAuth token exchange failed: ${reason}`);
  }
  return json;
}
