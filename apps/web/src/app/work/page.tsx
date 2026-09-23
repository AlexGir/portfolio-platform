import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/ui/container';
import { CaseStudyCard } from '@/components/case-study/case-study-card';
import { caseStudies } from '@/content/case-studies';

export const metadata: Metadata = {
  title: 'Projets',
  description: "L'ensemble des études de cas : contexte, démarche et résultats.",
};

export default function WorkIndexPage() {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <section className="py-16 sm:py-24">
          <Container>
            <p className="eyebrow text-accent-text dark:text-accent">Tous les projets</p>
            <h1 className="display-xl mt-4 font-display">Projets</h1>
            <p className="mt-6 max-w-2xl text-muted sm:text-lg">
              Chaque étude de cas revient sur le problème posé, la démarche suivie et ce qui a
              changé, pas seulement le résultat final.
            </p>

            <ul className="mt-16">
              {caseStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} />
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
