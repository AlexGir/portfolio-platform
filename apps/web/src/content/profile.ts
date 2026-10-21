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
    'Je suis Product Designer. Je travaille sur des logiciels métier que les gens ouvrent tous les matins sans les avoir choisis. Mon premier réflexe est d’aller les regarder s’en servir.',
  bio: [
    "Je travaille depuis bientôt cinq ans sur des SaaS B2B, pour des labos de recherche, des structures de santé et des boîtes qui font de l'innovation. Je commence rarement par un écran. J'ai besoin de comprendre le métier d'abord, de voir comment les gens s'en servent, et de repérer les moments où le produit leur complique la journée. Le reste vient après.",
    "Chez SKALES, j'étais le designer principal. Je suis arrivé en stage pour un audit UX, je suis resté cinq ans, et pendant ces cinq ans tout le design produit est passé par moi. J'ai mené la refonte de la plateforme, du premier entretien jusqu'aux écrans livrés. J'ai aussi monté le design system qui sert aujourd'hui de base à tous leurs produits, avec son theming par client et l'accessibilité réglée à cet endroit plutôt que dans chaque écran.",
    "Ma formation est en informatique, un master mi-dev mi-design à Paris-Saclay, et je n'ai jamais lâché le sujet. Concrètement, ça joue surtout sur le moment où je tranche. Je sais à peu près ce qu'une fonctionnalité va coûter à construire, et ce qu'une reprise coûte quand on change d'avis trois sprints plus tard. Alors je pose la question quand elle sert encore à quelque chose.",
    "Depuis juin 2025 je suis en freelance. J'ai accompagné le lancement d'une marketplace sur deux phases, la seconde parce que la première s'était bien passée. Le reste du temps, je teste les outils d'IA sur de vrais sujets de conception, pour voir ce qu'ils font gagner et ce qu'ils font perdre. Je garde aussi une habitude prise chez SKALES. J'écris ce que je cherche et pourquoi je tranche, parce qu'une méthode qui repose sur une seule personne ne tient pas longtemps.",
  ],
  email: 'alexandre.giraud1995@gmail.com',
  socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandre-giraud-072624142' }],
  resume: {
    href: '/cv-alexandre-giraud-product-designer.pdf',
    updated: 'Septembre 2026',
  },
  availability:
    "Ouvert aux opportunités Product Designer en CDI, en Île-de-France ou à distance, et c'est ma priorité aujourd'hui. Également disponible pour des missions freelance.",
};
