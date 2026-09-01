import { env } from './env';

/** Thrown for any non-2xx response from the API. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  /** Bearer token to attach to this request. */
  accessToken?: string;
}

interface ErrorEnvelope {
  error?: { code?: string; message?: string };
}

/**
 * Fetch JSON from the platform API. Always sends credentials so the
 * `HttpOnly` refresh cookie travels with auth calls.
 */
export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { accessToken, headers, ...rest } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...rest,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json') ?? false;
  const body: unknown = isJson ? await response.json() : null;

  if (!response.ok) {
    const envelope = (body ?? {}) as ErrorEnvelope;
    throw new ApiError(
      response.status,
      envelope.error?.message ?? response.statusText,
      envelope.error?.code,
    );
  }

  return body as T;
}
