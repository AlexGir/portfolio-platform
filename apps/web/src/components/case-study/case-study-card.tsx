import Link from 'next/link';
import type { CaseStudy } from '@/content/case-studies';
import { CoverArt } from './cover-art';

/** A case study entry on the homepage preview and the `/work` index. */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <li className="group border-t border-border first:border-t-0">
      <Link
        href={`/work/${study.slug}`}
        className="grid gap-6 py-8 transition-colors sm:grid-cols-[minmax(0,17rem)_1fr] sm:items-start sm:gap-10"
      >
        <div className="grain aspect-[16/10] overflow-hidden rounded-sm border border-border bg-surface">
          {study.coverImage ? (
            <img
              src={study.coverImage}
              alt=""
              width={1800}
              height={1069}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <CoverArt
              cover={study.cover}
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="eyebrow text-muted">{study.sector}</p>
            <span className="eyebrow text-muted">{study.year}</span>
          </div>

          <h3 className="display-md mt-3 font-display">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
              {study.title}
            </span>
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {study.summary}
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
            {study.tags.map((tag) => (
              <li key={tag} className="eyebrow text-muted">
                {tag}
              </li>
            ))}
          </ul>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-text dark:text-accent">
            Lire l&apos;étude de cas
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
