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
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-border py-6 sm:grid-cols-4">
      {ROWS.map((row) => (
        <div key={row.key}>
          <dt className="eyebrow text-accent">{row.label}</dt>
          <dd className="mt-1.5 text-sm text-fg/90">{meta[row.key]}</dd>
        </div>
      ))}
    </dl>
  );
}
