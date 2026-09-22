import { z } from 'zod';

/**
 * Schema for the process environment. Every variable the API needs is declared
 * here; the process refuses to start if one is missing or malformed
 * (see {@link loadConfig}).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  /** Browser origin allowed by CORS (the web app). */
  WEB_ORIGIN: z.string().url(),
  /** Public base URL of this API, used to build OAuth callback URLs. */
  API_PUBLIC_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  /*
   * Contact form (Resend). Optional on purpose, unlike everything above: the
   * API is already in production, and making these required would take the
   * whole service down — auth included — the moment it is deployed before the
   * Resend account exists. When they are absent, `POST /contact` answers 503
   * and the web form falls back to a plain mailto link.
   */
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_FROM_EMAIL: z.string().email().optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
});

export type AppConfig = Readonly<
  z.infer<typeof envSchema> & {
    readonly isProduction: boolean;
    readonly isTest: boolean;
  }
>;

/**
 * Parse and validate the environment into a typed, frozen config object.
 * @param env source variables, defaults to `process.env` (injectable for tests)
 * @throws if any required variable is missing or invalid, with a readable list
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return Object.freeze({
    ...parsed.data,
    isProduction: parsed.data.NODE_ENV === 'production',
    isTest: parsed.data.NODE_ENV === 'test',
  });
}
