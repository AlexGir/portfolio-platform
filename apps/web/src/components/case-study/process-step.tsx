import type { ProcessStep as ProcessStepData } from '@/content/case-studies';

/** One numbered beat of a case study's narrative, with an optional detail callout. */
export function ProcessStep({ step }: { step: ProcessStepData }) {
  return (
    <li className="grid gap-6 py-10 first:pt-0 sm:grid-cols-[auto_1fr] sm:gap-10">
      <span className="font-display text-3xl text-accent/70 sm:text-4xl" aria-hidden="true">
        {step.index}
      </span>

      <div className="max-w-2xl">
        <h3 className="font-display text-xl sm:text-2xl">{step.title}</h3>
        <div className="mt-3 space-y-3 text-fg/85">
          {step.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {step.detail ? (
          <div className="mt-5 rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-medium">{step.detail.heading}</p>
            <ul className="mt-2.5 space-y-1.5 text-sm text-muted">
              {step.detail.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent" aria-hidden="true">
                    →
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </li>
  );
}
