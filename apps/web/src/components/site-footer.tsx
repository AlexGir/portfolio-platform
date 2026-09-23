import { Container } from './ui/container';
import { profile } from '@/content/profile';

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted">
      <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex flex-wrap gap-4">
          <li>
            <a
              href={profile.resume.href}
              className="hover:text-fg"
              target="_blank"
              rel="noreferrer"
              data-umami-event="cv-ouvert"
              data-umami-event-source="pied-de-page"
            >
              CV
            </a>
          </li>
          {profile.socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                className="hover:text-fg"
                rel="me noreferrer"
                target="_blank"
                data-umami-event="reseau-ouvert"
                data-umami-event-reseau={social.label}
                data-umami-event-source="pied-de-page"
              >
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-fg"
              data-umami-event="email-clique"
              data-umami-event-source="pied-de-page"
            >
              Email
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
