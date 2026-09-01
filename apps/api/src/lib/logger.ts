import { pino, type Logger } from 'pino';

export type { Logger };

export interface LoggerOptions {
  level?: string;
  pretty?: boolean;
}

/**
 * Build the application logger. Pretty transport is opt-in (dev only) so that
 * production and test logs stay as newline-delimited JSON.
 */
export function createLogger({ level = 'info', pretty = false }: LoggerOptions = {}): Logger {
  return pino({
    level,
    ...(pretty
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          },
        }
      : {}),
  });
}

/** A logger that discards everything — handy as a default in tests. */
export const silentLogger: Logger = pino({ level: 'silent' });
