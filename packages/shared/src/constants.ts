/** Cross-cutting constants shared by the web and api apps. */

/** Access token lifetime in seconds (15 minutes). */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

/** Refresh token lifetime in seconds (30 days). */
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

/** Name of the cookie holding the refresh token on the web client. */
export const REFRESH_TOKEN_COOKIE = 'pp_refresh';

/** Standard `Authorization` scheme for API access tokens. */
export const BEARER_PREFIX = 'Bearer ';
