import type { CaseStudyMeta } from '@/content/case-studies';

const ROWS: { key: keyof CaseStudyMeta; label: string }[] = [
  { key: 'client', label: 'Client' },
  { key: 'role', label: 'Rôle' },
  { key: 'timeline', label: 'Durée' },
  { key: 'whatChanged', label: 'Ce qui a changé' },
];

/** The client / role / timeline / outcome quick-facts strip at the top of a case study. */
export function MetaGrid({ meta }: { meta: CaseStudyMeta }) {
  return (
    <dl className="reveal-group grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
      {ROWS.map((row) => (
        <div key={row.key} className="border-t-2 border-rule py-5">
          <dt className="eyebrow text-accent-text dark:text-accent">{row.label}</dt>
          <dd className="mt-2.5 text-sm text-fg/90">{meta[row.key]}</dd>
        </div>
      ))}
    </dl>
  );
}
