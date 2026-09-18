import Link from 'next/link';
import type { CaseStudy } from '@/content/case-studies';
import { CoverArt } from './cover-art';

/** A case study entry on the homepage preview and the `/work` index. */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <li>
      <Link
        href={`/work/${study.slug}`}
        className="group grid gap-6 rounded-xl border border-border p-4 transition-colors hover:bg-surface sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center sm:p-6"
      >
        <div className="grain aspect-[4/3] overflow-hidden rounded-lg border border-border">
          <CoverArt
            cover={study.cover}
            className="h-full w-full scale-100 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="eyebrow text-muted">{study.sector}</p>
            <span className="text-sm text-muted">{study.year}</span>
          </div>

          <h3 className="mt-2 font-display text-xl leading-snug sm:text-2xl">{study.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted">{study.summary}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-fg/80"
              >
                {tag}
              </li>
            ))}
          </ul>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Lire l&apos;étude de cas
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
