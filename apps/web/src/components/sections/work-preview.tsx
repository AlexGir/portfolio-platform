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
      lead="Quatre études de cas détaillées : le problème posé, les options écartées, ce qui a été testé, et ce qui a changé. Livrables réels à l'appui."
    >
      <ul>
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </ul>

      <Link
        href="/work"
        className="mt-10 inline-flex items-center gap-2 border-b-2 border-rule pb-1 text-sm font-medium transition-colors hover:border-accent hover:text-accent-text dark:hover:text-accent"
      >
        Voir tous les projets →
      </Link>
    </Section>
  );
}
