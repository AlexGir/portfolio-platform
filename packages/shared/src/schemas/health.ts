import { z } from 'zod';

/** Coarse health state reported by a service's `/health` endpoint. */
export const healthStatusSchema = z.enum(['ok', 'degraded', 'down']);
export type HealthStatus = z.infer<typeof healthStatusSchema>;

/**
 * Shape returned by `GET /health` on the API.
 * Kept intentionally small so it is cheap to call from uptime probes and the
 * web app's status widget.
 */
export const healthResponseSchema = z.object({
  status: healthStatusSchema,
  /** Logical service name, e.g. `"api"`. */
  service: z.string().min(1),
  /** Semver or build identifier of the running process. */
  version: z.string().min(1),
  /** Process uptime in seconds at the moment the response was built. */
  uptimeSeconds: z.number().nonnegative(),
  /** ISO-8601 timestamp of the response. */
  timestamp: z.string().datetime(),
});
export type HealthResponse = z.infer<typeof healthResponseSchema>;
