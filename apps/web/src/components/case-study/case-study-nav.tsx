import Link from 'next/link';
import type { CaseStudy } from '@/content/case-studies';

/** Prev / next case study links at the bottom of a case study page. */
export function CaseStudyNav({ previous, next }: { previous: CaseStudy; next: CaseStudy }) {
  return (
    <nav
      aria-label="Autres projets"
      className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2"
    >
      <Link
        href={`/work/${previous.slug}`}
        className="group bg-bg p-6 transition-colors hover:bg-surface"
      >
        <p className="eyebrow text-muted">Précédent</p>
        <p className="mt-2 font-display text-lg transition-colors group-hover:text-accent">
          {previous.title}
        </p>
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className="group bg-bg p-6 text-right transition-colors hover:bg-surface"
      >
        <p className="eyebrow text-muted">Suivant</p>
        <p className="mt-2 font-display text-lg transition-colors group-hover:text-accent">
          {next.title}
        </p>
      </Link>
    </nav>
  );
}
