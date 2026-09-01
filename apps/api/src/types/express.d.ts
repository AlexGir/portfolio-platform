import type { AccessTokenPayload } from '@portfolio/shared';

declare global {
  namespace Express {
    interface Request {
      /** Populated by the `authenticate` middleware on protected routes. */
      user?: AccessTokenPayload;
    }
  }
}

export {};
