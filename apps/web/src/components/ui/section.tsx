import type { ReactNode } from 'react';
import { Container } from './container';

interface SectionProps {
  id: string;
  /** Visible section title. */
  title: string;
  /** Short intro line under the title. */
  lead?: string;
  children: ReactNode;
}

/** A page section with a consistent heading block and scroll anchor. */
export function Section({ id, title, lead, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 border-t border-border py-16 sm:py-20"
    >
      <Container>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {lead ? <p className="mt-3 max-w-2xl text-muted">{lead}</p> : null}
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}
