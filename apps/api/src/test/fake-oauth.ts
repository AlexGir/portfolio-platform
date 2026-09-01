import type { OAuthProvider } from '@portfolio/shared';
import type { OAuthRegistry, OAuthUserProfile } from '../modules/auth/oauth-provider.js';

function defaultProfile(provider: OAuthProvider): OAuthUserProfile {
  return {
    provider,
    providerAccountId: `${provider}-account-1`,
    email: `${provider}-user@example.com`,
    displayName: `${provider} user`,
    avatarUrl: null,
  };
}

/**
 * Network-free OAuth registry for integration tests: `createAuthorizationUrl`
 * returns a dummy URL carrying the state, `fetchProfile` returns a canned
 * profile (override per provider as needed).
 */
export function fakeOAuthRegistry(
  overrides: Partial<Record<OAuthProvider, OAuthUserProfile>> = {},
): OAuthRegistry {
  const adapter = (provider: OAuthProvider) => ({
    createAuthorizationUrl: ({ state }: { state: string }) =>
      new URL(`https://provider.test/${provider}/authorize?state=${state}`),
    fetchProfile: () => Promise.resolve(overrides[provider] ?? defaultProfile(provider)),
  });

  return { github: adapter('github'), google: adapter('google') };
}
