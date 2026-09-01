import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import type { PrismaClient } from '@prisma/client';
import type { AppConfig } from './config/env.js';
import { silentLogger, type Logger } from './lib/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import type { HealthChecker } from './modules/health/health.service.js';
import { healthRouter } from './modules/health/health.router.js';
import { AuthService } from './modules/auth/auth.service.js';
import { authRouter } from './modules/auth/auth.router.js';
import type { OAuthRegistry } from './modules/auth/oauth-provider.js';
import { usersRouter } from './modules/users/users.router.js';
import { createGraphQLHandler, GRAPHQL_ENDPOINT } from './graphql/yoga.js';

export interface AppDependencies {
  config: AppConfig;
  prisma: PrismaClient;
  oauth: OAuthRegistry;
  logger?: Logger;
  /** Version string surfaced by `/health`; defaults to `0.0.0`. */
  version?: string;
  /** Injectable clock, forwarded to the auth service (tests). */
  now?: () => Date;
}

/**
 * Build the Express application without binding a port. `src/index.ts` wires the
 * real dependencies and calls `listen`; tests call this directly with fakes.
 */
export function createApp(deps: AppDependencies): Express {
  const { config, prisma, oauth } = deps;
  const logger = deps.logger ?? silentLogger;
  const version = deps.version ?? '0.0.0';
  const meta = { service: 'api', version } as const;

  const healthChecker: HealthChecker = {
    async checkDatabase() {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    },
  };

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }));
  app.use(pinoHttp({ logger }));
  app.use(cookieParser(config.JWT_REFRESH_SECRET));

  // GraphQL Yoga reads the raw request body, so mount it before `express.json()`.
  app.use(
    GRAPHQL_ENDPOINT,
    createGraphQLHandler({
      prisma,
      health: healthChecker,
      meta,
      accessSecret: config.JWT_ACCESS_SECRET,
    }),
  );

  app.use(express.json());

  const authService = new AuthService({
    prisma,
    accessSecret: config.JWT_ACCESS_SECRET,
    now: deps.now,
  });

  app.use(healthRouter(healthChecker, meta));
  app.use(
    '/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),
    authRouter({
      oauth,
      authService,
      webOrigin: config.WEB_ORIGIN,
      secureCookies: config.isProduction,
    }),
  );
  app.use(usersRouter({ prisma, accessSecret: config.JWT_ACCESS_SECRET }));

  app.use(notFoundHandler);
  app.use(errorHandler(logger));

  return app;
}
