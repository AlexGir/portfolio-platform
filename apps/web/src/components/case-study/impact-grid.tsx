import type { ImpactMetric } from '@/content/case-studies';

/** Outcome metrics grid closing a case study. */
export function ImpactGrid({ impact }: { impact: ImpactMetric[] }) {
  return (
    <dl className="reveal-group grid grid-cols-1 sm:grid-cols-2">
      {impact.map((metric) => (
        <div key={metric.label} className="border-t border-border py-6 pr-6 sm:py-8">
          <dd className="display-md font-display text-accent">{metric.value}</dd>
          <dt className="eyebrow mt-3 text-muted">{metric.label}</dt>
        </div>
      ))}
    </dl>
  );
}
