import Link from 'next/link';
import { Section } from '../ui/section';
import { CaseStudyCard } from '../case-study/case-study-card';
import { caseStudies } from '@/content/case-studies';

/** Homepage teaser: every case study, each linking to its full `/work/[slug]` page. */
export function WorkPreview() {
  return (
    <Section
      id="work"
      eyebrow="Sélection"
      title="Projets"
      lead="Trois missions qui montrent comment j'aborde un problème : le contexte, ce qui a été essayé, ce qui a marché."
    >
      <ul className="space-y-6">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </ul>

      <Link
        href="/work"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        Voir tous les projets →
      </Link>
    </Section>
  );
}
