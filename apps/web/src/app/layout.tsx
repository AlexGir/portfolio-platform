import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeScript } from '@/components/theme-script';
import { AuthProvider } from '@/lib/auth-context';
import { Analytics } from '@/components/analytics';
import { profile } from '@/content/profile';
import { env } from '@/lib/env';

/**
 * Rendered by `pnpm --filter @portfolio/web og:capture` from the content below,
 * so it has to be regenerated when the name, role or tagline changes. A unit
 * test fails if the file is missing.
 */
const OG_IMAGE = '/og.png';
const OG_ALT = `${profile.name} — ${profile.role}`;

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
  style: ['normal', 'italic'],
  display: 'swap',
});

/** Labels, numerals and metadata — the "system annotation" voice of the layout. */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
});

/**
 * `metadataBase` is what lets every relative URL below resolve to an absolute
 * one. Without it a share card has no image: platforms will not follow a
 * relative path, and the preview falls back to bare text.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: profile.tagline,
    url: '/',
    siteName: profile.name,
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    // `summary` renders a thumbnail beside the text; the large card is the one
    // that actually shows the image.
    card: 'summary_large_image',
    title: `${profile.name} | ${profile.role}`,
    description: profile.tagline,
    images: [{ url: OG_IMAGE, alt: OG_ALT }],
  },
};

/**
 * Tells the browser both schemes are supported, so its own chrome — scrollbars,
 * form controls, the address bar on mobile — follows the page instead of
 * staying light behind a dark layout.
 */
export const viewport: Viewport = {
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-strong focus:px-3 focus:py-2 focus:text-accent-fg"
        >
          Aller au contenu
        </a>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
