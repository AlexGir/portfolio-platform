'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/umami';

/**
 * Signale qu'une etude de cas a ete lue jusqu'au bout.
 *
 * C'est la mesure qui distingue un recruteur qui a vraiment lu d'un visiteur
 * qui a rebondi — impossible a deduire des pages vues seules. Un
 * IntersectionObserver sur une sentinelle en fin d'article : purement passif,
 * il ne peut ni bloquer le rendu ni intercepter une interaction, et il se
 * desabonne des qu'il a tire une fois.
 */
export function ReadTracker({ slug }: { slug: string }) {
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    let done = false;
    const observer = new IntersectionObserver((entries) => {
      if (done || !entries[0]?.isIntersecting) return;
      done = true;
      trackEvent('etude-lue', { etude: slug });
      observer.disconnect();
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [slug]);

  // 1px de haut et pas zero : un element d'aire nulle est un cas limite de
  // l'IntersectionObserver, dont le comportement varie selon les moteurs.
  // Invisible a l'oeil, sans effet sur la mise en page.
  return <div ref={sentinel} aria-hidden="true" className="h-px w-full" />;
}
