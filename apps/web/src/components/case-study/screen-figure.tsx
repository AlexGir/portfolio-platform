import type { Screen, ScreenGroup } from '@/content/case-studies';

/**
 * A product screenshot inside a case study.
 *
 * Distinct from `BoardFigure` on purpose: a board is a method deliverable with
 * a standalone HTML original behind it, so it links out and carries a title bar.
 * A screen is just the interface, so it carries its own alt text and a caption
 * and nothing to click.
 *
 * `priority` marks the one image above the fold. Every other figure loads
 * lazily, and all of them declare their intrinsic size so the page does not
 * jump as they arrive.
 */
export function ScreenFigure({ screen, priority = false }: { screen: Screen; priority?: boolean }) {
  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <img
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 max-w-2xl text-sm text-muted">{screen.caption}</figcaption>
    </figure>
  );
}

/**
 * Several screenshots side by side, read as one figure.
 *
 * The row is exposed as a single labelled image: three phone screens described
 * by three separate alt texts would read as disconnected fragments, whereas one
 * sentence says what the sequence shows. The individual files are therefore
 * decorative inside it.
 *
 * Below `sm` three phones share ~325px and nothing in them is legible, so the
 * row keeps each screen at a readable width and scrolls sideways instead — the
 * same affordance the boards and the decision tables already use.
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
      <div className="overflow-x-auto" role="img" aria-label={group.alt}>
        <div className="flex gap-4 sm:gap-6">
          {group.images.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              className="block h-auto w-52 shrink-0 rounded-xl border border-border bg-surface sm:w-auto sm:min-w-0 sm:flex-1"
            />
          ))}
        </div>
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
