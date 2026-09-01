'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/lib/auth-context';

/**
 * Client-side guarded for now: the API is the real authority (every protected
 * call is checked server-side). A server-rendered guard can come with SSR
 * session support later.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { status, user, logout } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated' || !user) {
    return (
      <main id="content" className="flex min-h-dvh items-center">
        <Container>
          <p className="text-sm text-muted" role="status">
            Chargement…
          </p>
        </Container>
      </main>
    );
  }

  return (
    <main id="content" className="min-h-dvh py-12">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Bonjour, {user.displayName}</h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout().then(() => router.replace('/'))}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            Se déconnecter
          </button>
        </div>

        <section aria-labelledby="apps-title" className="mt-10">
          <h2 id="apps-title" className="text-lg font-medium">
            Applications
          </h2>
          <div className="mt-4 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted">
              Aucune application pour l&apos;instant. Les outils personnels apparaîtront ici.
            </p>
          </div>
        </section>

        <p className="mt-10 text-sm">
          <Link href="/" className="text-muted hover:text-fg">
            ← Retour au site
          </Link>
        </p>
      </Container>
    </main>
  );
}
