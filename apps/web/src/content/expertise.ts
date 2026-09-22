export interface ExpertiseArea {
  title: string;
  summary: string;
  skills: string[];
}

/**
 * Grouped so the section reads as capabilities, not a keyword dump, and
 * ordered the way the profile should be read: design first, the technical
 * background last — it is the differentiator, not the job title.
 */
export const expertiseAreas: ExpertiseArea[] = [
  {
    title: 'Recherche & discovery',
    summary: 'Comprendre le problème avant de dessiner, et savoir le prouver.',
    skills: [
      'Entretiens utilisateurs',
      'Questionnaires',
      'Personas',
      'Analyse de parcours (GA, funnels, heatmaps)',
      'Benchmark concurrentiel',
      'Audit heuristique',
    ],
  },
  {
    title: 'Conception produit',
    summary: 'Des parcours qui tiennent debout pour plusieurs profils à la fois.',
    skills: [
      "Architecture de l'information",
      'User flows',
      'Wireframes & storyboards',
      'Prototypes interactifs',
      'Design multi-profils',
      'Accessibilité (WCAG)',
    ],
  },
  {
    title: 'Design systems',
    summary: "Un socle qui survit à ceux qui l'ont construit, du token à la doc.",
    skills: [
      'Design tokens',
      'Theming multi-clients',
      'Spécifications de composants',
      'Figma & Storybook',
      'Gouvernance et adoption',
    ],
  },
  {
    title: 'Validation',
    summary: 'Décider sur des résultats, pas sur des avis en réunion.',
    skills: [
      "Tests d'utilisabilité",
      'A/B testing',
      'Mesure avant / après',
      'Design thinking',
      "Facilitation d'ateliers",
      'Agile / Scrum',
    ],
  },
  {
    title: 'Profil technique',
    summary:
      "Je conçois en sachant ce que chaque option coûte à implémenter — et je code quand c'est le plus court chemin.",
    skills: [
      'TypeScript',
      'React',
      'Next.js',
      'HTML / CSS',
      'Material UI',
      'Spécifications pour code généré par IA',
    ],
  },
  {
    title: 'Outils',
    summary: "Ceux que j'utilise au quotidien, IA comprise, avec une méthode qui tient sans eux.",
    skills: ['Figma', 'Adobe XD', 'Miro', 'Jira', 'Google Analytics', 'Claude', 'n8n'],
  },
];
