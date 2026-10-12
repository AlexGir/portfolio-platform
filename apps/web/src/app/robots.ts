import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Served at `/robots.txt`.
 *
 * Everything public is crawlable — this is a portfolio, being found is the
 * point. The two disallowed paths are the private dashboard and the login page
 * that leads to it: neither is linked from anywhere on the site, but both
 * answer 200, and a search result pointing a recruiter at a sign-in form is
 * worse than no result at all.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/dashboard', '/auth/'],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
