/** Public runtime configuration for the web app. */
export const env = {
  /** Base URL of the platform API. */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  /**
   * Umami audience measurement. Both must be set for tracking to load — the
   * site works identically without them, which keeps local development and
   * the e2e suite free of any analytics call.
   */
  umami: {
    src: process.env.NEXT_PUBLIC_UMAMI_SRC ?? '',
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '',
  },
} as const;
