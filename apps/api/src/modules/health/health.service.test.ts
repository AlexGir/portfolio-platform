import { describe, expect, it, vi } from 'vitest';
import { buildHealthReport, type HealthChecker } from './health.service.js';

const meta = {
  service: 'api',
  version: '1.2.3',
  now: () => new Date('2026-09-01T10:00:00.000Z'),
  uptimeSeconds: () => 42.9,
};

const checker = (result: boolean | (() => Promise<boolean>)): HealthChecker => ({
  checkDatabase: typeof result === 'function' ? result : () => Promise.resolve(result),
});

describe('buildHealthReport', () => {
  it('reports ok when the database responds', async () => {
    const report = await buildHealthReport(checker(true), meta);
    expect(report).toEqual({
      status: 'ok',
      service: 'api',
      version: '1.2.3',
      uptimeSeconds: 42,
      timestamp: '2026-09-01T10:00:00.000Z',
    });
  });

  it('reports degraded when the database check returns false', async () => {
    const report = await buildHealthReport(checker(false), meta);
    expect(report.status).toBe('degraded');
  });

  it('reports degraded (never throws) when the database check rejects', async () => {
    const report = await buildHealthReport(
      checker(() => Promise.reject(new Error('connection refused'))),
      meta,
    );
    expect(report.status).toBe('degraded');
  });

  it('floors fractional uptime and never goes negative', async () => {
    const report = await buildHealthReport(checker(true), { ...meta, uptimeSeconds: () => -5 });
    expect(report.uptimeSeconds).toBe(0);
  });

  it('uses the real clock by default', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2030-01-01T00:00:00.000Z'));
    const report = await buildHealthReport(checker(true), { service: 'api', version: '0.0.0' });
    expect(report.timestamp).toBe('2030-01-01T00:00:00.000Z');
    vi.useRealTimers();
  });
});
