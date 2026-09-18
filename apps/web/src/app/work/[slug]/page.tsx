import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Container } from '@/components/ui/container';
import { CoverArt } from '@/components/case-study/cover-art';
import { MetaGrid } from '@/components/case-study/meta-grid';
import { ProcessStep } from '@/components/case-study/process-step';
import { ReflectionCallout } from '@/components/case-study/reflection-callout';
import { ImpactGrid } from '@/components/case-study/impact-grid';
import { CaseStudyNav } from '@/components/case-study/case-study-nav';
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
          <header className="grain relative overflow-hidden border-b border-border">
            <CoverArt
              cover={study.cover}
              className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60 dark:opacity-30"
            />
            <Container className="py-16 sm:py-24">
              <Link href="/work" className="text-sm text-muted hover:text-fg">
                ← Tous les projets
              </Link>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <p className="eyebrow text-accent">{study.sector}</p>
                <p className="text-sm text-muted">
                  {study.year} · {study.readingTime} de lecture
                </p>
              </div>

              <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight tracking-tight sm:text-5xl">
                {study.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted">{study.summary}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-bg/70 px-3 py-1 text-xs text-fg/80 backdrop-blur"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Container>
          </header>

          <Container className="py-14 sm:py-20">
            <MetaGrid meta={study.meta} />

            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-xl sm:text-2xl">Le problème</h2>
                <div className="mt-3 space-y-3 text-fg/85">
                  {study.overview.problem.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl">La solution</h2>
                <div className="mt-3 space-y-3 text-fg/85">
                  {study.overview.solution.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 border-t border-border pt-14">
              <p className="eyebrow text-accent">Démarche</p>
              <p className="mt-3 max-w-2xl font-display text-xl sm:text-2xl">
                {study.approachIntro}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {study.methods.map((method) => (
                  <li
                    key={method}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {method}
                  </li>
                ))}
              </ul>

              <ol className="mt-4 divide-y divide-border">
                {study.steps.map((step) => (
                  <ProcessStep key={step.index} step={step} />
                ))}
              </ol>
            </div>

            <div className="mt-4 border-t border-border pt-14">
              <ReflectionCallout label={study.reflection.label} text={study.reflection.text} />
            </div>

            <div className="mt-14 border-t border-border pt-14">
              <h2 className="font-display text-xl sm:text-2xl">Résultats</h2>
              <div className="mt-6">
                <ImpactGrid impact={study.impact} />
              </div>
              <p className="mt-6 max-w-2xl text-fg/85">{study.closing}</p>
            </div>

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
