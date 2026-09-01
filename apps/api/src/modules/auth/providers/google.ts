import { z } from 'zod';
import type {
  AuthorizationUrlInput,
  FetchProfileInput,
  OAuthProviderAdapter,
  OAuthUserProfile,
} from '../oauth-provider.js';
import { badRequest } from '../../../lib/http-error.js';
import { deriveCodeChallenge, exchangeCodeForToken } from '../../../lib/oauth2.js';

const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
const SCOPES = 'openid email profile';

const googleUserinfoSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  email_verified: z.boolean().optional(),
  name: z.string().nullish(),
  picture: z.string().url().nullish(),
});

/** Pure mapper from Google's OIDC userinfo shape to our normalised profile. */
export function mapGoogleUserinfo(raw: unknown): OAuthUserProfile {
  const info = googleUserinfoSchema.parse(raw);
  if (info.email_verified === false) {
    throw badRequest('Google account e-mail is not verified');
  }
  return {
    provider: 'google',
    providerAccountId: info.sub,
    email: info.email,
    displayName: info.name ?? info.email,
    avatarUrl: info.picture ?? null,
  };
}

export interface GoogleAdapterConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/** Google OAuth2 with mandatory PKCE (S256). */
export function createGoogleAdapter(config: GoogleAdapterConfig): OAuthProviderAdapter {
  return {
    createAuthorizationUrl({ state, codeVerifier }: AuthorizationUrlInput): URL {
      const url = new URL(AUTHORIZE_URL);
      url.searchParams.set('client_id', config.clientId);
      url.searchParams.set('redirect_uri', config.redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', SCOPES);
      url.searchParams.set('state', state);
      url.searchParams.set('code_challenge', deriveCodeChallenge(codeVerifier));
      url.searchParams.set('code_challenge_method', 'S256');
      return url;
    },

    async fetchProfile({ code, codeVerifier }: FetchProfileInput): Promise<OAuthUserProfile> {
      const token = await exchangeCodeForToken({
        tokenEndpoint: TOKEN_URL,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        code,
        redirectUri: config.redirectUri,
        codeVerifier,
      });

      const res = await fetch(USERINFO_URL, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      if (!res.ok) {
        throw badRequest(`Google userinfo request failed (${res.status})`);
      }
      return mapGoogleUserinfo(await res.json());
    },
  };
}
