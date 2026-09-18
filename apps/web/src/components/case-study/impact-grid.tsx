import type { ImpactMetric } from '@/content/case-studies';

/** Outcome metrics grid closing a case study. */
export function ImpactGrid({ impact }: { impact: ImpactMetric[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
      {impact.map((metric) => (
        <div key={metric.label} className="bg-bg p-5">
          <dd className="font-display text-2xl text-accent sm:text-3xl">{metric.value}</dd>
          <dt className="mt-1.5 text-sm text-muted">{metric.label}</dt>
        </div>
      ))}
    </dl>
  );
}
