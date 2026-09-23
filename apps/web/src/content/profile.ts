/**
 * Single source of truth for the portfolio's personal content.
 * Edit these values — nothing here is fetched or generated.
 */

export interface SocialLink {
  label: string;
  href: string;
}

export interface ResumeLink {
  /** Served from `apps/web/public`. */
  href: string;
  /** Shown next to the link so a recruiter knows the file is current. */
  updated: string;
}

export interface Profile {
  name: string;
  /** The one-line positioning shown above the name — keep it a job title, not a sentence. */
  role: string;
  location: string;
  /** One or two sentences for the hero. */
  tagline: string;
  /** Longer bio for the About section, one paragraph per entry. */
  bio: string[];
  email: string;
  socials: SocialLink[];
  resume: ResumeLink;
  /** Short, honest availability line shown near the contact CTA. */
  availability: string;
}

export const profile: Profile = {
  name: 'Alexandre Giraud',
  role: 'Product Designer · SaaS B2B',
  location: 'Île-de-France · télétravail',
  tagline:
    "Je cherche d'abord pourquoi les gens décrochent. Les écrans viennent après, et ils sont testés avant d'être livrés.",
  bio: [
    "Product Designer avec près de 5 ans d'expérience sur des produits SaaS B2B, de la modélisation des workflows jusqu'à la livraison des écrans et des user stories. Recherche utilisateur, conception d'interfaces, design systems : j'interviens sur toute la chaîne.",
    "Chez SKALES, j'ai créé et porté la fonction design de l'entreprise. J'ai piloté la refonte complète d'une plateforme de gestion de projets utilisée en R&D, en santé et dans l'innovation, et créé le design system qui est devenu le socle de tous ses produits. Depuis juin 2025, je travaille en freelance et sur mes propres projets.",
    "Mon parcours en informatique (Master Informatique et Design d'Interfaces, Paris-Saclay) change la façon dont je conçois : je sais ce que chaque option coûte à implémenter, je dialogue d'égal à égal avec les développeurs, et je vais coder moi-même les composants quand c'est le plus court chemin. Ce site en est un exemple : je l'ai conçu et développé de bout en bout.",
  ],
  email: 'alexandre.giraud1995@gmail.com',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandre-giraud-072624142' },
    { label: 'GitHub', href: 'https://github.com/AlexGir' },
  ],
  resume: {
    href: '/cv-alexandre-giraud-product-designer.pdf',
    updated: 'Septembre 2026',
  },
  availability:
    "Ouvert aux opportunités Product Designer en CDI, en Île-de-France ou à distance, et c'est ma priorité aujourd'hui. Également disponible pour des missions freelance.",
};
