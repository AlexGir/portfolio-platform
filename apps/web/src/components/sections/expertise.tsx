import { Section } from '../ui/section';
import { expertiseAreas } from '@/content/expertise';

export function Expertise() {
  return (
    <Section
      id="expertise"
      eyebrow="Ce que je fais"
      title="Expertise"
      lead="Ce sur quoi j'interviens concrètement, du cadrage à la mise en production."
    >
      <ul className="reveal-group">
        {expertiseAreas.map((area, index) => (
          <li
            key={area.title}
            className="grid gap-x-8 gap-y-3 border-t border-border py-7 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_minmax(0,1fr)]"
          >
            <span className="numeral text-sm text-accent-text dark:text-accent" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div>
              <h3 className="font-display text-xl sm:text-2xl">{area.title}</h3>
              <p className="mt-1.5 max-w-xl text-muted">{area.summary}</p>

              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                {area.skills.map((skill) => (
                  <li
                    key={skill}
                    className="border border-border px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-fg/75"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
