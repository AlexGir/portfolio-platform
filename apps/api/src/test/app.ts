import type { Express } from 'express';
import type { PrismaClient } from '@prisma/client';
import type { AppConfig } from '../config/env.js';
import { createApp } from '../app.js';
import { fakeOAuthRegistry } from './fake-oauth.js';
import type { OAuthRegistry } from '../modules/auth/oauth-provider.js';

/** A complete, frozen config for integration tests. */
export function testConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return Object.freeze({
    NODE_ENV: 'test',
    API_PORT: 0,
    WEB_ORIGIN: 'http://localhost:3000',
    API_PUBLIC_URL: 'http://localhost:4000',
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    JWT_ACCESS_SECRET: 'integration-access-secret-0123456789',
    JWT_REFRESH_SECRET: 'integration-refresh-secret-0123456789',
    GITHUB_CLIENT_ID: 'gh-id',
    GITHUB_CLIENT_SECRET: 'gh-secret',
    GOOGLE_CLIENT_ID: 'g-id',
    GOOGLE_CLIENT_SECRET: 'g-secret',
    isProduction: false,
    isTest: true,
    ...overrides,
  }) as AppConfig;
}

export interface IntegrationAppOptions {
  prisma: PrismaClient;
  oauth?: OAuthRegistry;
  config?: Partial<AppConfig>;
}

export function createIntegrationApp({ prisma, oauth, config }: IntegrationAppOptions): Express {
  return createApp({
    config: testConfig(config),
    prisma,
    oauth: oauth ?? fakeOAuthRegistry(),
    version: 'test',
  });
}
