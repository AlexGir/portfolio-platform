/**
 * Error type recognised by the central error handler. Anything thrown that is
 * not an `HttpError` is treated as an unexpected 500.
 */
export class HttpError extends Error {
  readonly status: number;
  /** Stable, machine-readable code, e.g. `"unauthorized"`. */
  readonly code: string;
  /** Optional safe-to-expose context (validation issues, etc.). */
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message = 'Bad request', details?: unknown): HttpError =>
  new HttpError(400, 'bad_request', message, details);

export const unauthorized = (message = 'Unauthorized'): HttpError =>
  new HttpError(401, 'unauthorized', message);

export const forbidden = (message = 'Forbidden'): HttpError =>
  new HttpError(403, 'forbidden', message);

export const notFound = (message = 'Not found'): HttpError =>
  new HttpError(404, 'not_found', message);

export const conflict = (message = 'Conflict'): HttpError =>
  new HttpError(409, 'conflict', message);
