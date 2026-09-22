import type { CoverTone } from '@/content/case-studies';

/**
 * Generated abstract cover art for a case study — used on cards and the case
 * study header. No real project screenshots exist yet (see content/case-studies.ts),
 * so each project gets a distinct, intentional-looking visual instead of an
 * empty box, built purely from its two brand tones.
 */
export function CoverArt({ cover, className = '' }: { cover: CoverTone; className?: string }) {
  const id = `${cover.variant}-${cover.primary.slice(1)}-${cover.secondary.slice(1)}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={cover.primary} stopOpacity="0.16" />
          <stop offset="100%" stopColor={cover.secondary} stopOpacity="0.1" />
        </linearGradient>
        <filter id={`${id}-blur`}>
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>

      <rect width="400" height="300" fill={`url(#${id}-bg)`} />

      {cover.variant === 'aurora' ? (
        <g filter={`url(#${id}-blur)`}>
          <circle cx="120" cy="90" r="90" fill={cover.primary} opacity="0.55" />
          <circle cx="300" cy="200" r="110" fill={cover.secondary} opacity="0.5" />
          <circle cx="260" cy="60" r="60" fill={cover.secondary} opacity="0.35" />
        </g>
      ) : null}

      {cover.variant === 'orbit' ? (
        <g fill="none" stroke={cover.primary} strokeOpacity="0.55">
          <circle cx="200" cy="150" r="50" />
          <circle cx="200" cy="150" r="90" />
          <circle cx="200" cy="150" r="130" strokeOpacity="0.3" />
          <circle cx="200" cy="150" r="6" fill={cover.secondary} stroke="none" />
          <circle cx="283" cy="107" r="5" fill={cover.primary} stroke="none" />
          <circle cx="97" cy="197" r="4" fill={cover.secondary} stroke="none" />
          <circle cx="290" cy="220" r="3.5" fill={cover.primary} stroke="none" />
        </g>
      ) : null}

      {cover.variant === 'signal' ? (
        <g>
          {Array.from({ length: 22 }).map((_, i) => {
            // Deterministic pseudo-random bar heights — a measurement motif.
            const height = 30 + Math.abs(Math.sin(i * 1.7)) * 150;
            return (
              <rect
                key={i}
                x={14 + i * 17}
                y={(300 - height) / 2}
                width="9"
                height={height}
                rx="4.5"
                fill={i % 3 === 0 ? cover.secondary : cover.primary}
                opacity={i % 3 === 0 ? 0.4 : 0.25}
              />
            );
          })}
        </g>
      ) : null}

      {cover.variant === 'grid' ? (
        <g>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => {
              const size = 18 + ((row + col) % 3) * 6;
              const on = (row + col) % 3 !== 0;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={20 + col * 46}
                  y={10 + row * 46}
                  width={size}
                  height={size}
                  rx="4"
                  fill={on ? cover.primary : cover.secondary}
                  opacity={on ? 0.28 : 0.16}
                />
              );
            }),
          )}
        </g>
      ) : null}
    </svg>
  );
}
