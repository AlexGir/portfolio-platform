import type { ProcessStep as ProcessStepData } from '@/content/case-studies';
import { DecisionTable } from './decision-table';
import { BoardGallery } from './board-figure';

/**
 * One numbered beat of a case study's narrative, with an optional detail
 * callout, decision table and design boards.
 */
export function ProcessStep({ step }: { step: ProcessStepData }) {
  return (
    <li className="grid gap-x-10 gap-y-4 border-t border-border py-12 sm:grid-cols-[4.5rem_1fr] sm:py-16">
      <span className="numeral text-4xl leading-none text-accent sm:text-5xl" aria-hidden="true">
        {step.index}
      </span>

      <div className="min-w-0">
        {/* Only the prose reveals: a step containing a board is far taller than
            the viewport, and revealing the whole thing would drag. */}
        <div className="reveal">
          <h3 className="display-sm max-w-2xl font-display">{step.title}</h3>
          <div className="mt-5 max-w-2xl space-y-4 text-fg/85">
            {step.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {step.detail ? (
          <div className="mt-7 max-w-2xl border-l-2 border-accent bg-surface p-6">
            <p className="eyebrow text-accent-text dark:text-accent">{step.detail.heading}</p>
            <ul className="mt-3 space-y-2 text-sm text-fg/80">
              {step.detail.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent" aria-hidden="true">
                    ·
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {step.table ? <DecisionTable table={step.table} /> : null}

        {step.boards ? <BoardGallery boards={step.boards} /> : null}
      </div>
    </li>
  );
}
