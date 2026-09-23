import { Section } from '../ui/section';
import { ContactForm } from './contact-form';
import { profile } from '@/content/profile';

export function Contact() {
  return (
    <Section id="contact" eyebrow="Prochaine étape" title="Contact" lead={profile.availability}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <ContactForm />

        <aside className="space-y-6">
          <div>
            <p className="eyebrow text-muted">Direct</p>
            <a
              href={`mailto:${profile.email}`}
              data-umami-event="email-clique"
              data-umami-event-source="contact"
              className="mt-2 block break-words text-sm transition-colors hover:text-accent-text dark:hover:text-accent"
            >
              {profile.email}
            </a>
          </div>

          <div>
            <p className="eyebrow text-muted">Ailleurs</p>
            <ul className="mt-2 space-y-1.5">
              {profile.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    data-umami-event="reseau-ouvert"
                    data-umami-event-reseau={social.label}
                    data-umami-event-source="contact"
                    className="text-sm transition-colors hover:text-accent-text dark:hover:text-accent"
                  >
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-muted">CV</p>
            <a
              href={profile.resume.href}
              target="_blank"
              rel="noreferrer"
              data-umami-event="cv-ouvert"
              data-umami-event-source="contact"
              className="mt-2 block text-sm transition-colors hover:text-accent-text dark:hover:text-accent"
            >
              PDF · mis à jour {profile.resume.updated} ↗
            </a>
          </div>
        </aside>
      </div>
    </Section>
  );
}
