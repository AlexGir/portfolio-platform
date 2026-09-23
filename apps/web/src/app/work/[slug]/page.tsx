import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/ui/container';
import { MetaGrid } from '@/components/case-study/meta-grid';
import { ProcessStep } from '@/components/case-study/process-step';
import { ReflectionCallout } from '@/components/case-study/reflection-callout';
import { ImpactGrid } from '@/components/case-study/impact-grid';
import { CaseStudyNav } from '@/components/case-study/case-study-nav';
import { BoardGallery } from '@/components/case-study/board-figure';
import { ReadTracker } from '@/components/case-study/read-tracker';
import { caseStudies, getCaseStudy } from '@/content/case-studies';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.summary };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const previous = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length]!;
  const next = caseStudies[(index + 1) % caseStudies.length]!;

  return (
    <>
      <SiteHeader />
      <main id="content">
        <article>
          <header className="grain relative overflow-hidden border-b-2 border-rule">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-48 -right-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-accent opacity-[0.13] blur-3xl dark:opacity-25"
            />
            <Container className="py-14 sm:py-20">
              <Link href="/work" className="eyebrow text-muted transition-colors hover:text-fg">
                ← Tous les projets
              </Link>

              <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <p className="eyebrow text-accent-text dark:text-accent">{study.sector}</p>
                <p className="eyebrow text-muted">
                  {study.year} · {study.readingTime} de lecture
                </p>
              </div>

              <h1 className="display-lg animate-fade-up mt-5 max-w-4xl font-display">
                {study.title}
              </h1>
              <p
                className="animate-fade-up mt-6 max-w-2xl text-muted sm:text-lg"
                style={{ animationDelay: '100ms' }}
              >
                {study.summary}
              </p>

              <ul className="mt-9 flex flex-wrap gap-x-3 gap-y-2">
                {study.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-border px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-fg/75"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Container>
          </header>

          <Container className="py-14 sm:py-20">
            <MetaGrid meta={study.meta} />

            <div className="reveal-group mt-20 grid gap-x-12 gap-y-10 lg:grid-cols-2">
              <div>
                <h2 className="eyebrow text-accent-text dark:text-accent">Le problème</h2>
                <div className="mt-5 space-y-4 leading-relaxed text-fg/85">
                  {study.overview.problem.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="eyebrow text-accent-text dark:text-accent">La solution</h2>
                <div className="mt-5 space-y-4 leading-relaxed text-fg/85">
                  {study.overview.solution.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="rule-strong mt-20 pt-12">
              <p className="eyebrow text-accent-text dark:text-accent">Démarche</p>
              <p className="display-md reveal mt-5 max-w-3xl font-display">{study.approachIntro}</p>
              <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
                {study.methods.map((method) => (
                  <li
                    key={method}
                    className="border border-border px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-muted"
                  >
                    {method}
                  </li>
                ))}
              </ul>

              {study.approachBoards ? (
                <div className="mt-12">
                  <BoardGallery boards={study.approachBoards} note />
                </div>
              ) : null}

              <ol className="mt-12">
                {study.steps.map((step) => (
                  <ProcessStep key={step.index} step={step} />
                ))}
              </ol>
            </div>

            <div className="rule-strong mt-8 pt-14">
              <ReflectionCallout label={study.reflection.label} text={study.reflection.text} />
            </div>

            <div className="rule-strong mt-20 pt-12">
              <h2 className="eyebrow text-accent-text dark:text-accent">Résultats</h2>
              <div className="mt-8">
                <ImpactGrid impact={study.impact} />
              </div>
              <p className="mt-10 max-w-2xl leading-relaxed text-fg/85">{study.closing}</p>
            </div>

            <ReadTracker slug={study.slug} />

            <div className="mt-16">
              <CaseStudyNav previous={previous} next={next} />
            </div>
          </Container>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
