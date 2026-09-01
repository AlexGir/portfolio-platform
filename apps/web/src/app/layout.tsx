import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ThemeScript } from '@/components/theme-script';
import { AuthProvider } from '@/lib/auth-context';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
        >
          Aller au contenu
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
