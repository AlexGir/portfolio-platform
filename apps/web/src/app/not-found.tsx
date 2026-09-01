import Link from 'next/link';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <main id="content" className="flex min-h-dvh items-center">
      <Container className="max-w-md">
        <p className="text-sm font-medium text-accent">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page introuvable</h1>
        <p className="mt-2 text-sm text-muted">
          Le lien est peut-être cassé, ou la page a été déplacée.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-accent hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </Container>
    </main>
  );
}
