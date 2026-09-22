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
            >
              CV
            </a>
          </li>
          {profile.socials.map((social) => (
            <li key={social.href}>
              <a href={social.href} className="hover:text-fg" rel="me noreferrer" target="_blank">
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${profile.email}`} className="hover:text-fg">
              Email
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
