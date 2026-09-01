import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Connexion',
  robots: { index: false },
};

const PROVIDERS = [
  { id: 'github', label: 'Continuer avec GitHub' },
  { id: 'google', label: 'Continuer avec Google' },
] as const;

export default function LoginPage() {
  return (
    <main id="content" className="flex min-h-dvh items-center">
      <Container className="max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Espace personnel</h1>
        <p className="mt-2 text-sm text-muted">
          Accès réservé. Connecte-toi avec un fournisseur pour rejoindre le dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={`${env.apiUrl}/auth/${provider.id}`}
              className="rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-surface"
            >
              {provider.label}
            </a>
          ))}
        </div>

        <p className="mt-8 text-sm">
          <Link href="/" className="text-muted hover:text-fg">
            ← Retour au portfolio
          </Link>
        </p>
      </Container>
    </main>
  );
}
