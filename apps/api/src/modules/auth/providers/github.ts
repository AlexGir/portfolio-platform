import { z } from 'zod';
import type {
  AuthorizationUrlInput,
  FetchProfileInput,
  OAuthProviderAdapter,
  OAuthUserProfile,
} from '../oauth-provider.js';
import { badRequest } from '../../../lib/http-error.js';
import { exchangeCodeForToken } from '../../../lib/oauth2.js';

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_API = 'https://api.github.com';
const SCOPES = 'read:user user:email';

const githubUserSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string().nullish(),
  avatar_url: z.string().url().nullish(),
  email: z.string().email().nullish(),
});

const githubEmailsSchema = z.array(
  z.object({
    email: z.string().email(),
    primary: z.boolean(),
    verified: z.boolean(),
  }),
);

/** Pick the best e-mail: primary+verified, else any verified, else the profile e-mail. */
export function resolveGitHubEmail(
  user: z.infer<typeof githubUserSchema>,
  emails: z.infer<typeof githubEmailsSchema>,
): string | null {
  const primary = emails.find((e) => e.primary && e.verified);
  if (primary) return primary.email;
  const verified = emails.find((e) => e.verified);
  if (verified) return verified.email;
  return user.email ?? null;
}

/** Pure mapper from GitHub's API shapes to our normalised profile. */
export function mapGitHubProfile(rawUser: unknown, rawEmails: unknown): OAuthUserProfile {
  const user = githubUserSchema.parse(rawUser);
  const emails = githubEmailsSchema.parse(rawEmails);
  const email = resolveGitHubEmail(user, emails);
  if (!email) {
    throw badRequest('GitHub account has no usable e-mail address');
  }
  return {
    provider: 'github',
    providerAccountId: String(user.id),
    email,
    displayName: user.name ?? user.login,
    avatarUrl: user.avatar_url ?? null,
  };
}

export interface GitHubAdapterConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/** GitHub OAuth2 (no PKCE support — `codeVerifier` is ignored). */
export function createGitHubAdapter(config: GitHubAdapterConfig): OAuthProviderAdapter {
  return {
    createAuthorizationUrl({ state }: AuthorizationUrlInput): URL {
      const url = new URL(AUTHORIZE_URL);
      url.searchParams.set('client_id', config.clientId);
      url.searchParams.set('redirect_uri', config.redirectUri);
      url.searchParams.set('scope', SCOPES);
      url.searchParams.set('state', state);
      url.searchParams.set('allow_signup', 'false');
      return url;
    },

    async fetchProfile({ code }: FetchProfileInput): Promise<OAuthUserProfile> {
      const token = await exchangeCodeForToken({
        tokenEndpoint: TOKEN_URL,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        code,
        redirectUri: config.redirectUri,
      });

      const headers = {
        Authorization: `Bearer ${token.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-platform',
      };
      const [userRes, emailsRes] = await Promise.all([
        fetch(`${GITHUB_API}/user`, { headers }),
        fetch(`${GITHUB_API}/user/emails`, { headers }),
      ]);
      if (!userRes.ok) {
        throw badRequest(`GitHub profile request failed (${userRes.status})`);
      }
      const rawEmails = emailsRes.ok ? await emailsRes.json() : [];
      return mapGitHubProfile(await userRes.json(), rawEmails);
    },
  };
}
