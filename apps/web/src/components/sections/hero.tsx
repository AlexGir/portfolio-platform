import { Container } from '../ui/container';
import { profile } from '@/content/profile';

/** The credentials a recruiter looks for, above the fold, without a scroll. */
const CREDENTIALS = [
  '~5 ans en SaaS B2B',
  'Responsable design produit',
  'Master Informatique & Design d’Interfaces',
  'Google UX Design Certificate',
];

export function Hero() {
  // Set on two lines at display size; the content file stays the source of truth.
  const [firstName, ...lastName] = profile.name.split(' ');

  return (
    <section className="grain relative overflow-hidden">
      {/* A single oversized accent field, bled off the right edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent opacity-[0.13] blur-3xl dark:opacity-25"
      />

      <Container>
        <div className="grid gap-x-10 border-b border-border pt-16 pb-14 sm:pt-24 sm:pb-20 lg:grid-cols-[10rem_minmax(0,1fr)]">
          <p className="eyebrow animate-fade-up pt-3 text-accent-text lg:text-right dark:text-accent">
            {profile.role}
          </p>

          <div>
            <h1
              className="display-xl animate-fade-up font-display"
              style={{ animationDelay: '80ms' }}
            >
              {firstName}
              {lastName.length > 0 ? (
                <>
                  <br />
                  {lastName.join(' ')}
                </>
              ) : null}
            </h1>

            <p
              className="animate-fade-up mt-7 max-w-2xl text-lg leading-relaxed text-fg/80 sm:text-xl"
              style={{ animationDelay: '160ms' }}
            >
              {profile.tagline}
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
              style={{ animationDelay: '240ms' }}
            >
              <a
                href="#work"
                data-umami-event="cta-projets"
                className="bg-accent-strong px-6 py-3 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5"
              >
                Voir mes études de cas
              </a>
              <a
                href={profile.resume.href}
                target="_blank"
                rel="noreferrer"
                data-umami-event="cv-ouvert"
                data-umami-event-source="hero"
                className="border-b-2 border-rule pb-1 text-sm font-medium transition-colors hover:border-accent hover:text-accent-text dark:hover:text-accent"
              >
                Voir mon CV ↗
              </a>
              <a
                href="#contact"
                className="border-b-2 border-transparent pb-1 text-sm font-medium text-muted transition-colors hover:border-rule hover:text-fg"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>

        {/* Credentials strip: reads as a caption row under the masthead. */}
        <ul
          className="animate-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ animationDelay: '320ms' }}
        >
          {CREDENTIALS.map((credential, index) => (
            <li
              key={credential}
              className={`eyebrow border-b border-border py-4 leading-relaxed text-muted lg:border-b-0 lg:py-5 lg:pr-6 ${
                index > 0 ? 'lg:border-l lg:border-border lg:pl-6' : ''
              }`}
            >
              {credential}
            </li>
          ))}
        </ul>

        <p className="flex items-center gap-2.5 py-5 text-sm text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.location} · {profile.availability}
        </p>
      </Container>
    </section>
  );
}
