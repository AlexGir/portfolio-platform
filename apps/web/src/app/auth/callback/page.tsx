'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/lib/auth-context';

/**
 * Landing spot for the API's OAuth redirect. The refresh cookie is already set;
 * we just exchange it for a session and move on to the dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    void refresh().then((ok) => {
      if (ok) {
        router.replace('/dashboard');
      } else {
        setFailed(true);
      }
    });
  }, [refresh, router]);

  return (
    <main id="content" className="flex min-h-dvh items-center">
      <Container className="max-w-sm text-center">
        {failed ? (
          <>
            <h1 className="text-xl font-semibold">Connexion impossible</h1>
            <p className="mt-2 text-sm text-muted">
              La session n&apos;a pas pu être établie. Réessaie depuis la page de connexion.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm text-accent hover:underline">
              Retour à la connexion
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted" role="status">
            Connexion en cours…
          </p>
        )}
      </Container>
    </main>
  );
}
