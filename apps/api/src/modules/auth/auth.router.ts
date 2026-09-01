import { Router, type CookieOptions, type Response } from 'express';
import { accessTokenResponseSchema, oauthProviderSchema } from '@portfolio/shared';
import { generateCodeVerifier, generateState } from '../../lib/oauth2.js';
import { badRequest, unauthorized } from '../../lib/http-error.js';
import type { AuthService, IssuedSession } from './auth.service.js';
import type { OAuthRegistry } from './oauth-provider.js';

const STATE_COOKIE = 'pp_oauth_state';
const VERIFIER_COOKIE = 'pp_oauth_verifier';
const REFRESH_COOKIE = 'pp_refresh';
const REFRESH_PATH = '/auth';
const OAUTH_HANDSHAKE_MAX_AGE_MS = 10 * 60 * 1000;

export interface AuthRouterOptions {
  oauth: OAuthRegistry;
  authService: AuthService;
  /** Where to send the browser after a successful callback. */
  webOrigin: string;
  /** Set `Secure` on auth cookies (true in production, over HTTPS). */
  secureCookies: boolean;
}

export function authRouter(options: AuthRouterOptions): Router {
  const { oauth, authService, webOrigin, secureCookies } = options;
  const router = Router();

  const handshakeCookie: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookies,
    signed: true,
    path: REFRESH_PATH,
    maxAge: OAUTH_HANDSHAKE_MAX_AGE_MS,
  };

  const setRefreshCookie = (res: Response, session: IssuedSession): void => {
    res.cookie(REFRESH_COOKIE, session.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: secureCookies,
      signed: true,
      path: REFRESH_PATH,
      expires: session.refreshExpiresAt,
    });
  };

  // Routes below are mounted under `/auth`.

  // Start the OAuth dance: stash state (+ PKCE verifier) and redirect to the provider.
  router.get('/:provider', (req, res, next) => {
    try {
      const provider = oauthProviderSchema.parse(req.params.provider);
      const state = generateState();
      const codeVerifier = generateCodeVerifier();

      res.cookie(STATE_COOKIE, state, handshakeCookie);
      res.cookie(VERIFIER_COOKIE, codeVerifier, handshakeCookie);

      const url = oauth[provider].createAuthorizationUrl({ state, codeVerifier });
      res.redirect(url.toString());
    } catch (error) {
      next(error);
    }
  });

  // Provider redirect target: verify state, exchange the code, open a session.
  router.get('/:provider/callback', async (req, res, next) => {
    try {
      const provider = oauthProviderSchema.parse(req.params.provider);
      const expectedState = req.signedCookies[STATE_COOKIE] as string | undefined;
      const codeVerifier = req.signedCookies[VERIFIER_COOKIE] as string | undefined;
      const { code, state } = req.query;

      res.clearCookie(STATE_COOKIE, { path: REFRESH_PATH });
      res.clearCookie(VERIFIER_COOKIE, { path: REFRESH_PATH });

      if (!expectedState || typeof state !== 'string' || state !== expectedState) {
        throw badRequest('Invalid or missing OAuth state');
      }
      if (typeof code !== 'string' || code.length === 0) {
        throw badRequest('Missing authorization code');
      }

      const profile = await oauth[provider].fetchProfile({
        code,
        codeVerifier: codeVerifier ?? '',
      });
      const user = await authService.findOrCreateUser(profile);
      const session = await authService.issueSession(user);

      setRefreshCookie(res, session);
      res.redirect(`${webOrigin}/auth/callback`);
    } catch (error) {
      next(error);
    }
  });

  // Exchange the refresh cookie for a new access token (and rotate the cookie).
  router.post('/refresh', async (req, res, next) => {
    try {
      const raw = req.signedCookies[REFRESH_COOKIE] as string | undefined;
      if (!raw) throw unauthorized('Missing refresh token');

      const session = await authService.rotateRefreshToken(raw);
      setRefreshCookie(res, session);
      res.json(
        accessTokenResponseSchema.parse({
          accessToken: session.accessToken,
          tokenType: 'Bearer',
          expiresIn: session.expiresIn,
        }),
      );
    } catch (error) {
      next(error);
    }
  });

  // Revoke the current refresh token and clear the cookie.
  router.post('/logout', async (req, res, next) => {
    try {
      const raw = req.signedCookies[REFRESH_COOKIE] as string | undefined;
      if (raw) await authService.revokeRefreshToken(raw);
      res.clearCookie(REFRESH_COOKIE, { path: REFRESH_PATH });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
