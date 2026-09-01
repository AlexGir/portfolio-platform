import { describe, expect, it } from 'vitest';
import { healthResponseSchema, healthStatusSchema } from './health.js';

describe('healthStatusSchema', () => {
  it('accepts the known states', () => {
    for (const state of ['ok', 'degraded', 'down'] as const) {
      expect(healthStatusSchema.parse(state)).toBe(state);
    }
  });

  it('rejects unknown states', () => {
    expect(healthStatusSchema.safeParse('unknown').success).toBe(false);
  });
});

describe('healthResponseSchema', () => {
  const valid = {
    status: 'ok',
    service: 'api',
    version: '0.1.0',
    uptimeSeconds: 12.5,
    timestamp: '2026-09-01T10:00:00.000Z',
  };

  it('parses a well-formed response', () => {
    expect(healthResponseSchema.parse(valid)).toEqual(valid);
  });

  it('rejects a negative uptime', () => {
    const result = healthResponseSchema.safeParse({ ...valid, uptimeSeconds: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects a non ISO-8601 timestamp', () => {
    const result = healthResponseSchema.safeParse({ ...valid, timestamp: '01/09/2026' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty service name', () => {
    expect(healthResponseSchema.safeParse({ ...valid, service: '' }).success).toBe(false);
  });
});
