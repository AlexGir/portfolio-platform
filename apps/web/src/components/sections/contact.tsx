import { Section } from '../ui/section';
import { profile } from '@/content/profile';

export function Contact() {
  return (
    <Section id="contact" title="Contact" lead={profile.availability}>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          {profile.email}
        </a>
        {profile.socials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
          >
            {social.label}
          </a>
        ))}
      </div>
    </Section>
  );
}
