/**
 * Single source of truth for the portfolio's personal content.
 * Edit these values — nothing here is fetched or generated.
 */

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  /** TODO: replace with your full name. */
  name: string;
  role: string;
  location: string;
  /** One or two sentences for the hero. */
  tagline: string;
  /** Longer bio for the About section, one paragraph per entry. */
  bio: string[];
  email: string;
  socials: SocialLink[];
  /** Short, honest availability line shown near the contact CTA. */
  availability: string;
}

export const profile: Profile = {
  name: 'Alex G.',
  role: 'Développeur Full-Stack · UX / Product Design',
  location: 'France · télétravail',
  tagline:
    "Je conçois et développe des produits web de bout en bout — de la recherche utilisateur à l'architecture back-end, en passant par le design system et l'interface.",
  bio: [
    "Développeur Full-Stack avec environ 5 ans d'expérience, au croisement du développement web, de l'UX Research et du Product / UX-UI Design. J'accorde autant d'importance à la qualité technique qu'à l'expérience réelle des utilisateurs.",
    "J'ai surtout travaillé dans de petites équipes, où j'intervenais sur toutes les étapes d'un produit : cadrage UX, design d'interface, développement front et back, architecture, librairie de composants et applications clientes.",
    "Ce site est lui-même un terrain d'expérimentation : monorepo TypeScript, API Express (REST + GraphQL), authentification OAuth2/JWT, PostgreSQL, et une suite de tests Vitest + Playwright.",
  ],
  email: 'alexg91@live.fr',
  socials: [
    { label: 'GitHub', href: 'https://github.com/AlexGir' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
  availability: 'Ouvert aux discussions pour des missions produit / full-stack.',
};
