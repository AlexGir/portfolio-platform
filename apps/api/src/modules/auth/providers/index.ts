import type { AppConfig } from '../../../config/env.js';
import type { OAuthRegistry } from '../oauth-provider.js';
import { createGitHubAdapter } from './github.js';
import { createGoogleAdapter } from './google.js';

/** Build the real provider registry from validated config. */
export function createOAuthRegistry(config: AppConfig): OAuthRegistry {
  const redirectUri = (provider: string) => `${config.API_PUBLIC_URL}/auth/${provider}/callback`;

  return {
    github: createGitHubAdapter({
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      redirectUri: redirectUri('github'),
    }),
    google: createGoogleAdapter({
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      redirectUri: redirectUri('google'),
    }),
  };
}
