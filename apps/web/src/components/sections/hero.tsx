import { Container } from '../ui/container';
import { profile } from '@/content/profile';

export function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <p className="text-sm font-medium uppercase tracking-widest text-accent">{profile.role}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{profile.tagline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            Voir les projets
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
          >
            Me contacter
          </a>
          <span className="text-sm text-muted">{profile.location}</span>
        </div>
      </Container>
    </section>
  );
}
