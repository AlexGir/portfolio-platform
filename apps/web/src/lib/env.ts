/** Public runtime configuration for the web app. */
export const env = {
  /** Base URL of the platform API. */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
} as const;
