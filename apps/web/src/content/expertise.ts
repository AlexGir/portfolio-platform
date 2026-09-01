export interface ExpertiseArea {
  title: string;
  summary: string;
  skills: string[];
}

/** Grouped so the section reads as capabilities, not a keyword dump. */
export const expertiseAreas: ExpertiseArea[] = [
  {
    title: 'Front-end',
    summary: 'Interfaces accessibles et performantes, pensées comme un système.',
    skills: [
      'TypeScript',
      'React (hooks, context)',
      'Next.js (App Router)',
      'Tailwind CSS',
      'Design systems',
    ],
  },
  {
    title: 'Back-end',
    summary: 'APIs claires, typées et testées, du modèle de données à la sécurité.',
    skills: ['Node.js', 'Express', 'REST', 'GraphQL', 'OAuth2 / JWT', 'PostgreSQL'],
  },
  {
    title: 'Product & UX',
    summary: 'De la recherche utilisateur aux décisions produit, avec des livrables actionnables.',
    skills: ['UX Research', 'Product Design', 'Figma', 'Prototypage', 'Design systems'],
  },
  {
    title: 'Qualité & delivery',
    summary: 'Une base de code qui reste modifiable dans la durée.',
    skills: ['Vitest', 'Playwright', 'CI/CD', 'Scrum', 'Revue de code', 'Observabilité'],
  },
];
