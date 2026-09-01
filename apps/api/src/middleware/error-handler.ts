import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error.js';
import type { Logger } from '../lib/logger.js';

/** Uniform error envelope returned by the API. */
export interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Terminal middleware: converts anything thrown downstream into a JSON error. */
export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (err, req, res, _next) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({
        error: { code: err.code, message: err.message, details: err.details },
      } satisfies ErrorBody);
      return;
    }

    if (err instanceof ZodError) {
      res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Request validation failed',
          details: err.flatten(),
        },
      } satisfies ErrorBody);
      return;
    }

    logger.error({ err, method: req.method, path: req.path }, 'Unhandled error');
    res.status(500).json({
      error: { code: 'internal_error', message: 'Internal server error' },
    } satisfies ErrorBody);
  };
}

/** Catch-all for unmatched routes; hands a 404 `HttpError` to {@link errorHandler}. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'not_found', `Route not found: ${req.method} ${req.path}`));
};
