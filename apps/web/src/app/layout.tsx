import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeScript } from '@/components/theme-script';
import { AuthProvider } from '@/lib/auth-context';
import { Analytics } from '@/components/analytics';
import { profile } from '@/content/profile';

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

export const metadata: Metadata = {
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: profile.tagline,
    type: 'website',
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
