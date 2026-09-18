import { Section } from '../ui/section';
import { profile } from '@/content/profile';

export function About() {
  return (
    <Section
      id="about"
      eyebrow="Profil"
      title="À propos"
      lead="Un profil hybride, entre ingénierie et design produit."
    >
      <div className="max-w-2xl space-y-4 font-display text-lg leading-relaxed text-fg/90 sm:text-xl">
        {profile.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
