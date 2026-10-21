import type { Screen, ScreenGroup } from '@/content/case-studies';

/**
 * A product screenshot inside a case study.
 *
 * On a phone a 2880px-wide desktop capture cannot be made legible inline:
 * shrinking it to the column turns the interface into a smear, and letting it
 * scroll sideways means never seeing the figure whole. Neither is acceptable,
 * so the image always fits the column — enough to read the composition — and
 * the whole figure opens the full-resolution file, where the phone's own
 * viewer gives pinch-zoom for free. No JS, and the same affordance the boards
 * already use.
 *
 * `priority` marks the one image above the fold. Every other figure loads
 * lazily, and all of them declare their intrinsic size so the page does not
 * jump as they arrive.
 */
export function ScreenFigure({ screen, priority = false }: { screen: Screen; priority?: boolean }) {
  return (
    <figure className="mt-8">
      <a
        href={screen.src}
        target="_blank"
        rel="noreferrer"
        data-umami-event="ecran-ouvert"
        data-umami-event-ecran={screen.src}
        className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent focus-visible:border-accent"
      >
        <img
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className="block h-auto w-full"
        />
        <span className="flex justify-end border-t border-border px-4 py-2.5 text-sm">
          <span className="whitespace-nowrap text-muted transition-colors group-hover:text-accent">
            Voir en grand ↗
          </span>
        </span>
      </a>

      <figcaption className="mt-3 max-w-2xl text-sm text-muted">{screen.caption}</figcaption>
    </figure>
  );
}

/**
 * Several screenshots read as one figure, e.g. three phone screens side by side.
 *
 * The row is exposed as a single labelled image: three phone screens described
 * by three separate alt texts would read as disconnected fragments, whereas one
 * sentence says what the sequence shows. The individual files are therefore
 * decorative inside it.
 *
 * Below `sm` they stack rather than scroll sideways. A phone screenshot shown
 * at the full column width is close to its real size and perfectly legible,
 * which is the whole point; squeezing three of them into one row is not.
 */
export function ScreenGroupFigure({
  group,
  priority = false,
}: {
  group: ScreenGroup;
  priority?: boolean;
}) {
  return (
    <figure className="mt-8">
      <div
        role="img"
        aria-label={group.alt}
        className="flex flex-col items-center gap-6 sm:flex-row sm:items-start"
      >
        {group.images.map((image) => (
          <img
            key={image.src}
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            className="block h-auto w-full max-w-xs rounded-xl border border-border bg-surface sm:max-w-none sm:min-w-0 sm:flex-1"
          />
        ))}
      </div>

      <figcaption className="mt-3 max-w-2xl text-sm text-muted">{group.caption}</figcaption>
    </figure>
  );
}

/** Picks the right figure for a case study's opening image. */
export function OpeningScreen({ screen }: { screen: Screen | ScreenGroup }) {
  return 'images' in screen ? (
    <ScreenGroupFigure group={screen} priority />
  ) : (
    <ScreenFigure screen={screen} priority />
  );
}

/** The note that applies to every reconstructed screen on a case study. */
export function ScreenNote() {
  return (
    <p className="mt-6 max-w-2xl text-xs text-muted">
      Écrans reconstitués en 2026. Les données affichées sont fictives.
    </p>
  );
}
