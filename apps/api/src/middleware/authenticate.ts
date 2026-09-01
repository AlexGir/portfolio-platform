import type { RequestHandler } from 'express';
import { BEARER_PREFIX } from '@portfolio/shared';
import { verifyAccessToken } from '../lib/jwt.js';
import { unauthorized } from '../lib/http-error.js';

/**
 * Require a valid `Authorization: Bearer <jwt>` header. On success the decoded
 * payload is attached as `req.user`; otherwise a 401 `HttpError` is forwarded.
 */
export function authenticate(accessSecret: string): RequestHandler {
  return async (req, _res, next) => {
    try {
      const header = req.header('authorization');
      if (!header || !header.startsWith(BEARER_PREFIX)) {
        throw unauthorized('Missing bearer token');
      }
      req.user = await verifyAccessToken(header.slice(BEARER_PREFIX.length), accessSecret);
      next();
    } catch (error) {
      next(error);
    }
  };
}
