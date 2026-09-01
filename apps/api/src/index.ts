import { loadConfig } from './config/env.js';
import { createLogger } from './lib/logger.js';
import { prisma } from './db/client.js';
import { createApp } from './app.js';
import { createOAuthRegistry } from './modules/auth/providers/index.js';

// Set by the package manager when started via `pnpm start` / `pnpm dev`.
const version = process.env.npm_package_version ?? '0.0.0';

const config = loadConfig();
const logger = createLogger({
  level: config.isProduction ? 'info' : 'debug',
  pretty: !config.isProduction && !config.isTest,
});

const app = createApp({ config, prisma, oauth: createOAuthRegistry(config), logger, version });

const server = app.listen(config.API_PORT, () => {
  logger.info({ port: config.API_PORT, env: config.NODE_ENV }, 'API listening');
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Shutting down');
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
