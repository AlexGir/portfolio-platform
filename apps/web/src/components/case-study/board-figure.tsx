import type { Board } from '@/content/case-studies';

/**
 * A design board: the rendered image links to the standalone HTML original.
 *
 * Boards live as self-contained HTML on a fixed 1800×1069 canvas
 * (`public/planches`), with a PNG rendered beside each one by
 * `pnpm --filter @portfolio/web boards:capture`. The preview uses the image
 * rather than an iframe on purpose: nested frames get blocked by ad blockers,
 * privacy modes and some embedded browsers, which would leave a blank box
 * where the only real design artefacts should be. The HTML stays the
 * "open full size" target, where the text is crisp and selectable.
 */
const BOARD_WIDTH = 1800;
const BOARD_HEIGHT = 1069;

function imageFor(board: Board): string {
  return board.src.replace(/\.html$/, '.png');
}

export function BoardFigure({ board }: { board: Board }) {
  return (
    <figure className="mt-8">
      <a
        href={board.src}
        target="_blank"
        rel="noreferrer"
        aria-label={`Ouvrir la planche « ${board.title} » en grand format`}
        className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent focus-visible:border-accent"
      >
        {/*
          On a phone the full board scaled to ~325px is unreadable, so it gets a
          minimum width and scrolls sideways instead — the same affordance the
          decision tables use. From `sm` up it simply fits the column.

          A plain <img>, not next/image: these are fixed-size static exports, and
          image optimisation would pull sharp into the standalone runtime for no
          real gain.
        */}
        <div className="overflow-x-auto">
          <img
            src={imageFor(board)}
            alt={`Planche de design : ${board.title}`}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full min-w-[34rem] sm:min-w-0"
          />
        </div>

        <span className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-sm">
          <span className="font-medium">{board.title}</span>
          <span className="whitespace-nowrap text-muted transition-colors group-hover:text-accent">
            Voir en grand ↗
          </span>
        </span>
      </a>

      <figcaption className="mt-3 max-w-2xl text-sm text-muted">{board.caption}</figcaption>
    </figure>
  );
}

/** A list of boards plus the one-time note on how these boards were produced. */
export function BoardGallery({ boards, note = false }: { boards: Board[]; note?: boolean }) {
  if (boards.length === 0) return null;

  return (
    <div>
      {boards.map((board) => (
        <BoardFigure key={board.src} board={board} />
      ))}
      {note ? (
        <p className="mt-6 max-w-2xl text-xs text-muted">
          Planches reconstituées en 2026 à partir des livrables originaux — ceux-ci appartiennent
          aux clients. Les contenus sensibles sont anonymisés.
        </p>
      ) : null}
    </div>
  );
}
