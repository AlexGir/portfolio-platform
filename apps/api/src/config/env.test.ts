import { describe, expect, it } from 'vitest';
import { loadConfig } from './env.js';

const base = {
  WEB_ORIGIN: 'http://localhost:3000',
  API_PUBLIC_URL: 'http://localhost:4000',
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  JWT_ACCESS_SECRET: 'access-secret-at-least-16',
  JWT_REFRESH_SECRET: 'refresh-secret-at-least-16',
  GITHUB_CLIENT_ID: 'gh-id',
  GITHUB_CLIENT_SECRET: 'gh-secret',
  GOOGLE_CLIENT_ID: 'g-id',
  GOOGLE_CLIENT_SECRET: 'g-secret',
} satisfies NodeJS.ProcessEnv;

describe('loadConfig', () => {
  it('parses a complete environment and applies defaults', () => {
    const config = loadConfig(base);
    expect(config.NODE_ENV).toBe('development');
    expect(config.API_PORT).toBe(4000);
    expect(config.isProduction).toBe(false);
    expect(config.isTest).toBe(false);
  });

  it('coerces API_PORT and flags production', () => {
    const config = loadConfig({ ...base, NODE_ENV: 'production', API_PORT: '8080' });
    expect(config.API_PORT).toBe(8080);
    expect(config.isProduction).toBe(true);
  });

  it('is frozen', () => {
    const config = loadConfig(base);
    expect(Object.isFrozen(config)).toBe(true);
  });

  it('throws a readable error listing every missing variable', () => {
    expect(() => loadConfig({})).toThrow(/Invalid environment configuration/);
    try {
      loadConfig({});
    } catch (error) {
      expect((error as Error).message).toContain('WEB_ORIGIN');
      expect((error as Error).message).toContain('JWT_ACCESS_SECRET');
    }
  });

  it('rejects a too-short JWT secret', () => {
    expect(() => loadConfig({ ...base, JWT_ACCESS_SECRET: 'short' })).toThrow(/JWT_ACCESS_SECRET/);
  });

  it('rejects a non-URL API_PUBLIC_URL', () => {
    expect(() => loadConfig({ ...base, API_PUBLIC_URL: 'not-a-url' })).toThrow(/API_PUBLIC_URL/);
  });
});
