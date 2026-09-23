import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * Self-hosted Umami tracker.
 *
 * Renders nothing unless both variables are set, so local development, the
 * test suite and any fork stay free of analytics calls. `data-do-not-track`
 * makes the script honour the browser's Do Not Track signal.
 *
 * No consent banner is needed as configured: Umami sets no cookie, the
 * instance is ours, nothing is shared with a third party and there is no
 * cross-site tracking. Turning on session replay or heatmaps would go beyond
 * audience measurement and change that — see docs/deployment.md.
 */
export function Analytics() {
  const { src, websiteId } = env.umami;
  if (!src || !websiteId) return null;

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      data-do-not-track="true"
      strategy="afterInteractive"
    />
  );
}
