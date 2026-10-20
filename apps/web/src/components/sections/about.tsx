import { Section } from '../ui/section';
import { profile } from '@/content/profile';

export function About() {
  return (
    <Section
      id="about"
      eyebrow="Profil"
      title="À propos"
      lead="Designer produit, plutôt côté UX. Avec assez de bagage technique pour ne pas demander l'impossible."
    >
      <div className="reveal-group max-w-3xl">
        {profile.bio.map((paragraph, index) => (
          <p
            key={index}
            className="border-t border-border py-5 font-display text-lg leading-[1.55] text-fg/90 first:border-t-0 first:pt-0 sm:text-xl"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
