import type { ReactNode } from 'react';
import { Container } from './container';

interface SectionProps {
  id: string;
  /** Small monospaced label above the title, e.g. "EXPERTISE". */
  eyebrow?: string;
  /** Visible section title. */
  title: string;
  /** Short intro line under the title. */
  lead?: string;
  children: ReactNode;
}

/**
 * A page section with a consistent heading block and scroll anchor.
 *
 * The heading sits in a two-column editorial grid on wide screens — label in
 * the margin, title and lead in the measure — and stacks below `lg`. The heavy
 * top rule is the layout's main structural device.
 */
export function Section({ id, eyebrow, title, lead, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rule-strong scroll-mt-20 py-16 sm:py-24"
    >
      <Container>
        <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[10rem_minmax(0,1fr)]">
          {eyebrow ? (
            <p className="eyebrow pt-2 text-accent-text lg:text-right dark:text-accent">
              {eyebrow}
            </p>
          ) : (
            <span aria-hidden="true" />
          )}

          <div className="reveal">
            <h2 id={`${id}-title`} className="display-lg font-display">
              {title}
            </h2>
            {lead ? <p className="mt-4 max-w-2xl text-muted sm:text-lg">{lead}</p> : null}
          </div>
        </div>

        <div className="mt-14 lg:pl-[13.5rem]">{children}</div>
      </Container>
    </section>
  );
}
