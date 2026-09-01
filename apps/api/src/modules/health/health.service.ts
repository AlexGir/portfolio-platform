import { healthResponseSchema, type HealthResponse } from '@portfolio/shared';

/** Minimal dependency the health check needs from the datastore. */
export interface HealthChecker {
  /** Resolves `true` when a trivial query succeeds. */
  checkDatabase(): Promise<boolean>;
}

export interface HealthMeta {
  service: string;
  version: string;
  /** Injectable clock, defaults to `Date`. */
  now?: () => Date;
  /** Injectable uptime source in seconds, defaults to `process.uptime`. */
  uptimeSeconds?: () => number;
}

/**
 * Build the `/health` payload. The service is `ok` when the database responds,
 * `degraded` when it does not (the process itself is still up and serving).
 */
export async function buildHealthReport(
  checker: HealthChecker,
  meta: HealthMeta,
): Promise<HealthResponse> {
  const now = meta.now ?? (() => new Date());
  const uptime = meta.uptimeSeconds ?? (() => process.uptime());

  let databaseOk = false;
  try {
    databaseOk = await checker.checkDatabase();
  } catch {
    databaseOk = false;
  }

  return healthResponseSchema.parse({
    status: databaseOk ? 'ok' : 'degraded',
    service: meta.service,
    version: meta.version,
    uptimeSeconds: Math.max(0, Math.floor(uptime())),
    timestamp: now().toISOString(),
  });
}
