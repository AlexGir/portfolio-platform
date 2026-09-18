import { Container } from '../ui/container';
import { CoverArt } from '../case-study/cover-art';
import { profile } from '@/content/profile';

const HERO_TONE = { variant: 'aurora' as const, primary: '#b8451f', secondary: '#e8b34a' };

export function Hero() {
  return (
    <section className="grain relative overflow-hidden border-b border-border py-24 sm:py-32">
      <CoverArt
        cover={HERO_TONE}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70 dark:opacity-40"
      />

      <Container>
        <div className="animate-fade-up flex items-center gap-2 text-sm text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.location}
        </div>

        <p className="eyebrow animate-fade-up mt-6 text-accent" style={{ animationDelay: '80ms' }}>
          {profile.role}
        </p>

        <h1
          className="animate-fade-up mt-4 font-display text-6xl tracking-tight sm:text-8xl"
          style={{ animationDelay: '150ms' }}
        >
          {profile.name}
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-xl text-lg text-fg/80 sm:text-xl"
          style={{ animationDelay: '220ms' }}
        >
          {profile.tagline}
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: '300ms' }}
        >
          <a
            href="#work"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            Me contacter
          </a>
        </div>

        <p className="animate-fade-up mt-6 text-sm text-muted" style={{ animationDelay: '360ms' }}>
          {profile.availability}
        </p>
      </Container>
    </section>
  );
}
