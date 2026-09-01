export interface Project {
  slug: string;
  title: string;
  /** One-line positioning. */
  summary: string;
  /** The problem and what was actually done. */
  description: string;
  role: string;
  stack: string[];
  year: string;
  /** Optional external link (case study, live site, repo). */
  href?: string;
  /** Optional highlighted outcome. */
  outcome?: string;
}

/**
 * Placeholder entries — replace with real work. Keep the shape; the UI and
 * tests rely on these fields.
 */
export const projects: Project[] = [
  {
    slug: 'portfolio-platform',
    title: 'Plateforme portfolio + apps perso',
    summary: 'Ce site : monorepo TypeScript, portfolio public et espace applicatif authentifié.',
    description:
      "Architecture d'une plateforme extensible : Next.js pour le site et le dashboard, API Express (REST + GraphQL) séparée, PostgreSQL via Prisma, authentification OAuth2/JWT écrite à la main. Le tout versionné avec sa CI et son déploiement.",
    role: 'Conception, architecture, développement full-stack',
    stack: ['Next.js', 'TypeScript', 'Express', 'GraphQL', 'PostgreSQL', 'Docker'],
    year: '2026',
    href: 'https://github.com/AlexGir/portfolio-platform',
    outcome: 'Base réutilisable pour héberger de futurs outils personnels.',
  },
  {
    slug: 'design-system',
    title: 'Design system & librairie de composants',
    summary: 'Composants partagés entre plusieurs applications clientes.',
    description:
      "Mise en place d'une librairie de composants React documentée, alignée sur les tokens Figma, avec tests visuels et d'accessibilité. Réduction de la duplication d'UI entre les produits de l'équipe.",
    role: 'UX-UI, développement front, documentation',
    stack: ['React', 'TypeScript', 'Storybook', 'Figma'],
    year: '2024',
    outcome: 'Cohérence visuelle et vélocité front accrues sur 3 applications.',
  },
  {
    slug: 'ux-research-refonte',
    title: 'Refonte guidée par la recherche utilisateur',
    summary: "Cadrage UX d'une refonte à partir d'entretiens et de tests d'usabilité.",
    description:
      "Conduite d'entretiens et de tests d'usabilité, synthèse des irritants, priorisation avec le produit, puis maquettage et implémentation des parcours critiques.",
    role: 'UX Research, Product Design, développement front',
    stack: ['Figma', 'React', 'Next.js'],
    year: '2023',
    outcome: 'Parcours clés simplifiés, friction mesurée en baisse sur les tests suivants.',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
