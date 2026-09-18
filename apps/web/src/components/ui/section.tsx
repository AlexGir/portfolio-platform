import type { ReactNode } from 'react';
import { Container } from './container';

interface SectionProps {
  id: string;
  /** Small uppercase label above the title, e.g. "EXPERTISE". */
  eyebrow?: string;
  /** Visible section title. */
  title: string;
  /** Short intro line under the title. */
  lead?: string;
  children: ReactNode;
}

/** A page section with a consistent heading block and scroll anchor. */
export function Section({ id, eyebrow, title, lead, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 border-t border-border py-16 sm:py-24"
    >
      <Container>
        {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
        <h2
          id={`${id}-title`}
          className={`font-display text-3xl tracking-tight sm:text-4xl ${eyebrow ? 'mt-3' : ''}`}
        >
          {title}
        </h2>
        {lead ? <p className="mt-3 max-w-2xl text-muted">{lead}</p> : null}
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
