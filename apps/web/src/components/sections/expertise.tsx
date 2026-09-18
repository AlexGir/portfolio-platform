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
      <ul className="grid gap-6 sm:grid-cols-2">
        {expertiseAreas.map((area) => (
          <li key={area.title} className="rounded-lg border border-border bg-surface p-5">
            <h3 className="font-display text-lg">{area.title}</h3>
            <p className="mt-1 text-sm text-muted">{area.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {area.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-fg/80"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
