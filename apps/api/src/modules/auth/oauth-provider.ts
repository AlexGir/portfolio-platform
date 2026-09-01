import type { OAuthProvider } from '@portfolio/shared';

/** Normalised identity returned by a provider after a successful code exchange. */
export interface OAuthUserProfile {
  provider: OAuthProvider;
  /** Stable id of the account at the provider. */
  providerAccountId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthorizationUrlInput {
  state: string;
  codeVerifier: string;
}

export interface FetchProfileInput {
  code: string;
  codeVerifier: string;
}

/**
 * Everything the auth router needs from a provider, behind an interface so tests
 * can substitute a fake with no network access.
 */
export interface OAuthProviderAdapter {
  createAuthorizationUrl(input: AuthorizationUrlInput): URL;
  fetchProfile(input: FetchProfileInput): Promise<OAuthUserProfile>;
}

export type OAuthRegistry = Record<OAuthProvider, OAuthProviderAdapter>;
