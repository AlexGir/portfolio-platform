import type { MetadataRoute } from 'next';
import { caseStudies } from '@/content/case-studies';
import { env } from '@/lib/env';

/**
 * Served at `/sitemap.xml`, generated from the case study content rather than
 * hand-listed: adding a study to `content/case-studies.ts` publishes its URL
 * here too, so the two can never drift apart.
 *
 * Priorities say what a recruiter should land on first. The case studies carry
 * the same weight as the homepage, because they are the point of the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: env.siteUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${env.siteUrl}/work`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...caseStudies.map((study) => ({
      url: `${env.siteUrl}/work/${study.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.9,
    })),
  ];
}
