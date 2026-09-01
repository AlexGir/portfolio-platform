import { Router } from 'express';
import { buildHealthReport, type HealthChecker, type HealthMeta } from './health.service.js';

/**
 * `GET /health` — returns 200 when healthy, 503 when degraded, so uptime probes
 * can rely on the status code alone.
 */
export function healthRouter(checker: HealthChecker, meta: HealthMeta): Router {
  const router = Router();

  router.get('/health', async (_req, res, next) => {
    try {
      const report = await buildHealthReport(checker, meta);
      res.status(report.status === 'ok' ? 200 : 503).json(report);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
