/** Public runtime configuration for the web app. */
export const env = {
  /** Base URL of the platform API. */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  /**
   * Canonical origin of the public site, used for `metadataBase`, the sitemap
   * and `robots.txt`. Defaulted to production rather than required: a missing
   * variable would otherwise break the build, and every deployment of this app
   * that matters serves exactly this domain.
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexandregiraud.tech',
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
