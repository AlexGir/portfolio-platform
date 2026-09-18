/**
 * Case study content — the single source of truth for both the homepage
 * "selected work" preview and the full `/work/[slug]` pages.
 *
 * These three are illustrative placeholders (fictional companies) that show
 * the shape and depth a real case study should have. Swap the copy, keep the
 * shape — the UI and tests rely on every field being present.
 */

export type CoverVariant = 'aurora' | 'grid' | 'orbit';

export interface CoverTone {
  variant: CoverVariant;
  /** Two hex colours the generated cover art is built from. */
  primary: string;
  secondary: string;
}

export interface CaseStudyMeta {
  client: string;
  role: string;
  timeline: string;
  whatChanged: string;
}

export interface ProcessStepDetail {
  heading: string;
  bullets: string[];
}

export interface ProcessStep {
  index: string;
  title: string;
  body: string[];
  detail?: ProcessStepDetail;
}

export interface ImpactMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  /** Outcome-phrased headline, e.g. "Making X feel like Y" — not a project name. */
  title: string;
  /** One sentence for the card: approach + a concrete number. */
  summary: string;
  sector: string;
  tags: string[];
  year: string;
  readingTime: string;
  cover: CoverTone;
  meta: CaseStudyMeta;
  overview: {
    problem: string[];
    solution: string[];
  };
  approachIntro: string;
  methods: string[];
  steps: ProcessStep[];
  reflection: {
    label: string;
    text: string;
  };
  impact: ImpactMetric[];
  closing: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'solane-onboarding',
    title: "Diviser par deux l'abandon à l'inscription d'un outil de facturation",
    summary:
      "Refonte de l'onboarding d'une app de facturation pour indépendants : 20 champs en une passe devenus un parcours progressif — activation à J+1 en hausse de 41 %.",
    sector: 'SaaS facturation · indépendants',
    tags: ['UX research', 'Onboarding', 'Design system'],
    year: '2025',
    readingTime: '4 min',
    cover: { variant: 'aurora', primary: '#b8451f', secondary: '#e8b34a' },
    meta: {
      client: 'Solane (SaaS de facturation)',
      role: 'Product designer — recherche, UI, tests',
      timeline: '7 semaines',
      whatChanged: "Un formulaire d'inscription unique remplacé par un parcours en 4 étapes",
    },
    overview: {
      problem: [
        "Solane aide les indépendants à facturer et suivre leurs paiements. À l'inscription, 20 champs (identité, régime fiscal, coordonnées bancaires, préférences de facturation) étaient demandés en une seule fois, avant même d'avoir montré la moindre valeur au visiteur.",
        "62 % des inscriptions commencées n'allaient jamais jusqu'à la première facture envoyée. Le support recevait des messages du type « je ne sais pas pourquoi vous me demandez déjà mon SIRET », signe que l'ordre des questions ne correspondait à aucun raisonnement pour l'utilisateur.",
      ],
      solution: [
        "Un parcours en 4 étapes qui commence par produire quelque chose (un modèle de facture rempli avec les infos de l'utilisateur) avant de demander les champs administratifs, avec des valeurs par défaut intelligentes déduites du secteur d'activité choisi en étape 1.",
      ],
    },
    approachIntro:
      'Comprendre où et pourquoi les gens décrochaient avant de toucher à une maquette.',
    methods: ['Analyse de funnel', '9 entretiens utilisateurs', 'Tri de cartes', 'Tests A/B'],
    steps: [
      {
        index: '01',
        title: 'Le funnel mentait sur le vrai problème',
        body: [
          "La donnée d'analytics montrait un décrochage massif à l'étape « coordonnées bancaires ». L'hypothèse évidente : les gens n'ont pas confiance, il faut rassurer sur la sécurité des données.",
          "Les entretiens ont montré autre chose : la plupart des utilisateurs abandonnaient avant même de lire le formulaire, dès qu'ils comprenaient sa longueur en le survolant. La confiance n'était pas le sujet — c'était la perception du temps à investir avant tout bénéfice.",
        ],
        detail: {
          heading: 'Ce que les entretiens ont changé',
          bullets: [
            "Le vrai point de friction est perçu avant d'être vécu, un simple scroll suffit à faire fuir",
            'Les indépendants testent 2 à 3 outils en parallèle avant de choisir : chaque minute perdue compte double',
            "Personne ne sait ce qu'est un « régime réel simplifié » sans l'avoir déjà rempli ailleurs",
          ],
        },
      },
      {
        index: '02',
        title: "Montrer la valeur avant de demander l'effort",
        body: [
          "Le nouveau parcours inverse l'ordre : étape 1 récupère juste le secteur d'activité et le nom de l'entreprise, puis génère immédiatement un aperçu de facture personnalisé. L'utilisateur voit le produit fonctionner avant qu'on lui demande quoi que ce soit d'administratif.",
          'Les champs fiscaux et bancaires arrivent ensuite, mais reformulés autour de la tâche (« Pour encaisser vos paiements ») plutôt que comme une liste de champs de base de données.',
        ],
        detail: {
          heading: 'Parcours en 4 étapes',
          bullets: [
            'Secteur + nom → aperçu de facture instantané',
            'Informations légales, pré-remplies quand possible (API SIRENE)',
            'Coordonnées bancaires, présentées comme la dernière étape avant encaissement',
            'Première facture envoyée dans le parcours, pas après',
          ],
        },
      },
      {
        index: '03',
        title: 'Un design system pour tenir la promesse dans la durée',
        body: [
          "Le risque d'un onboarding travaillé isolément est qu'il détonne avec le reste du produit. Les composants du parcours (champs, aperçu de facture, barre de progression) ont été versés dans le design system existant plutôt que construits à part, pour que la cohérence tienne au-delà du lancement.",
        ],
      },
    ],
    reflection: {
      label: 'Ce que ce projet a confirmé',
      text: "Un funnel d'analytics dit où les gens partent, jamais pourquoi. Le taux d'abandon le plus visible n'est pas toujours le bon point d'entrée : ici, le vrai décrochage avait lieu avant l'étape la plus longue, pas pendant.",
    },
    impact: [
      { label: 'Activation à J+1', value: '+41 %' },
      { label: 'Abandon à l’inscription', value: '−52 %' },
      { label: 'Temps jusqu’à la 1ère facture', value: '−3,5 min' },
      { label: 'Tickets support « pourquoi ces infos »', value: '−68 %' },
    ],
    closing:
      "L'équipe support a vu disparaître une catégorie entière de tickets, et le produit a gagné une histoire à raconter dès la première minute plutôt qu'un formulaire à remplir.",
  },
  {
    slug: 'kelva-design-system',
    title: 'Unifier 6 outils internes derrière un seul design system',
    summary:
      'Passage de 6 interfaces internes incohérentes à un design system commun, adopté par 3 équipes produit sans ralentir leur roadmap.',
    sector: 'Outils internes B2B',
    tags: ['Design system', 'Gouvernance', 'Développement front'],
    year: '2024',
    readingTime: '5 min',
    cover: { variant: 'grid', primary: '#1f6f6b', secondary: '#18140f' },
    meta: {
      client: 'Kelva (suite d’outils internes)',
      role: 'Design system lead — design & développement',
      timeline: '5 mois, par itérations',
      whatChanged:
        'Un design system versionné, adopté par 3 équipes, en remplacement de 6 UI ad hoc',
    },
    overview: {
      problem: [
        "Chaque équipe produit avait construit son propre outil interne (facturation, support, provisioning) au fil de l'eau. Résultat : 6 boutons différents pour « valider », des tableaux qui ne se comportaient pas pareil d'un outil à l'autre, et un temps de montée en compétence de plusieurs semaines pour toute personne changeant d'équipe.",
        "Côté développement, chaque composant était réécrit à chaque nouvel écran. Une simple évolution d'accessibilité (contraste, focus clavier) demandait 6 correctifs séparés.",
      ],
      solution: [
        "Un design system construit à partir de l'existant plutôt qu'en rupture : audit des patterns déjà en place, extraction de ceux qui marchaient, documentation des tokens (couleur, espacement, typographie) et une librairie de composants React versionnée, avec un processus d'adoption équipe par équipe plutôt qu'un big-bang.",
      ],
    },
    approachIntro: "Construire avec les équipes qui allaient devoir l'adopter, pas à côté d'elles.",
    methods: [
      'Audit UI des 6 outils',
      'Ateliers avec les tech leads',
      'Tokens & Storybook',
      'Plan d’adoption progressif',
    ],
    steps: [
      {
        index: '01',
        title:
          "Partir d'un système from-scratch aurait été plus rapide à concevoir, plus lent à adopter",
        body: [
          "La tentation initiale était de repartir d'une page blanche avec une librairie externe (une des grandes UI kits React). Plus rapide à mettre en place, visuellement cohérent immédiatement.",
          "Le problème serait apparu après : aucune des 6 équipes n'aurait reconnu ses propres patterns dedans, et la migration aurait demandé une réécriture complète de chaque outil au lieu d'une adoption progressive. Le choix a été de partir des composants existants les plus solides et de les nettoyer, pas de les remplacer.",
        ],
      },
      {
        index: '02',
        title: 'Des tokens avant des composants',
        body: [
          "Avant de toucher au moindre bouton, la couleur, l'espacement et la typographie ont été extraits en tokens documentés. C'est ce niveau, invisible pour les utilisateurs finaux, qui a permis ensuite de corriger un problème d'accessibilité une seule fois pour les 6 outils au lieu de 6 fois.",
        ],
        detail: {
          heading: 'Ce que les tokens ont réglé d’un coup',
          bullets: [
            'Contraste de texte conforme WCAG AA sur les 6 outils simultanément',
            'Un seul focus ring clavier, cohérent partout',
            "Espacements standardisés — fin des tableaux plus denses dans un outil que dans l'autre",
          ],
        },
      },
      {
        index: '03',
        title: 'Adopter équipe par équipe, avec un budget de migration explicite',
        body: [
          "Chaque équipe a migré un écran à la fois, avec un budget de temps négocié à l'avance plutôt qu'imposé. Les tech leads ont été impliqués dès les ateliers de tokens, pas seulement au moment de l'implémentation — ce qui a évité l'effet « design system imposé d'en haut » qui fait échouer beaucoup de ces projets.",
        ],
        detail: {
          heading: 'Processus d’adoption',
          bullets: [
            'Un tech lead référent par équipe, impliqué dès la phase tokens',
            'Migration écran par écran, jamais un big-bang',
            'Checklist qualité (accessibilité, responsive) intégrée à la revue de code',
          ],
        },
      },
    ],
    reflection: {
      label: 'Ce que ce projet a confirmé',
      text: "Un design system n'est pas un problème de composants, c'est un problème d'adoption. La partie visible (Storybook, tokens) est plus simple à livrer que la partie invisible : convaincre une équipe qui a déjà son outil qui marche de changer ses habitudes sans casser sa vélocité.",
    },
    impact: [
      { label: 'Outils unifiés', value: '6 → 1 système' },
      { label: 'Composants dupliqués supprimés', value: '−73 %' },
      { label: 'Temps d’implémentation d’un nouvel écran', value: '−35 %' },
      { label: 'Équipes ayant adopté le système', value: '3 / 3' },
    ],
    closing:
      'Un an après, le design system est devenu la référence par défaut pour tout nouvel outil interne — plus par habitude acquise que par obligation.',
  },
  {
    slug: 'voltra-supervision',
    title: 'Rendre lisible un dashboard de supervision que plus personne ne regardait vraiment',
    summary:
      "Refonte du poste de supervision temps réel d'une équipe support technique : d'un flux d'alertes ignoré à une vue de triage utilisée en continu.",
    sector: 'Supervision technique · temps réel',
    tags: ['Recherche terrain', 'UI dense', 'Produit temps réel'],
    year: '2023',
    readingTime: '4 min',
    cover: { variant: 'orbit', primary: '#3b3f8f', secondary: '#c23b3b' },
    meta: {
      client: 'Voltra (plateforme de supervision)',
      role: 'Product designer — recherche terrain, UI, prototypage',
      timeline: '2 mois',
      whatChanged: "Un flux d'alertes chronologique remplacé par une vue de triage priorisée",
    },
    overview: {
      problem: [
        "L'équipe support de Voltra surveille l'état de centaines de services clients depuis un dashboard listant les incidents par ordre d'arrivée. Avec 200 à 400 événements par jour, la liste défilait plus vite qu'elle ne pouvait être lue.",
        "Les agents avaient développé leurs propres filtres personnels dans des fichiers à part pour s'y retrouver — chacun avec sa méthode, aucune ne transmissible à un nouvel arrivant. Les vrais incidents critiques se perdaient parfois dans le flux.",
      ],
      solution: [
        "Une vue de triage qui regroupe les événements par gravité réelle et par service affecté plutôt que par heure d'arrivée, avec les filtres jusqu'ici personnels transformés en vues partagées configurables par l'équipe elle-même.",
      ],
    },
    approachIntro: "Observer le travail réel avant de discuter de l'interface.",
    methods: [
      'Observation en immersion (2 jours)',
      'Tri des 400 derniers incidents',
      'Prototypage rapide',
      'Tests avec les agents en poste',
    ],
    steps: [
      {
        index: '01',
        title: 'Le premier réflexe : une timeline plus claire',
        body: [
          "Le brief initial demandait une timeline mieux hiérarchisée visuellement — plus de couleur, une meilleure typographie, moins de bruit visuel. C'est ce qui a été esquissé en premier.",
          "Deux jours passés aux côtés des agents ont changé le diagnostic : le problème n'était pas la lisibilité de chaque ligne, mais l'ordre dans lequel les lignes apparaissaient. Un agent scrollait activement pour retrouver un incident critique noyé entre 40 alertes mineures du même service.",
        ],
        detail: {
          heading: 'Ce que l’observation a changé',
          bullets: [
            'Le tri chronologique traite un incident critique et une alerte cosmétique de la même façon',
            'Les agents créaient déjà, à la main, des filtres par gravité — la solution existait déjà en germe chez eux',
            "Personne ne lisait la timeline en entier : tout le monde scrollait à la recherche d'un signal",
          ],
        },
      },
      {
        index: '02',
        title: 'Passer du flux au triage',
        body: [
          'La timeline plus claire aurait résolu le mauvais problème. La refonte a plutôt regroupé les événements en trois colonnes de gravité (critique, à surveiller, informatif), chacune triable par service affecté — reprenant presque telle quelle la méthode que les agents avaient déjà inventée dans leurs fichiers personnels.',
        ],
        detail: {
          heading: 'Vue de triage',
          bullets: [
            'Trois colonnes de gravité plutôt qu’un flux unique',
            'Regroupement automatique par service pour repérer les pannes en cascade',
            'Vues sauvegardées, partageables entre agents d’une même équipe',
          ],
        },
      },
      {
        index: '03',
        title: 'Tester avec les agents en conditions réelles, pas en salle de réunion',
        body: [
          "Le prototype a été testé directement sur le poste de deux agents volontaires pendant une astreinte réelle, plutôt qu'en session de test isolée. Un ajustement est apparu que les entretiens seuls n'auraient pas révélé : le regroupement par service masquait parfois un pic transverse (plusieurs services touchés par une même cause). Un bandeau de corrélation a été ajouté au-dessus des colonnes pour ce cas précis.",
        ],
      },
    ],
    reflection: {
      label: 'Ce que ce projet a confirmé',
      text: "Un écran dense n'est pas un problème en soi tant qu'il est organisé selon la façon dont les gens décident, pas selon l'ordre dans lequel les données arrivent. Le bon réflexe design (« simplifier visuellement ») aurait raté le vrai problème, qui était un problème de structure, pas de style.",
    },
    impact: [
      { label: 'Temps pour identifier un incident critique', value: '−58 %' },
      { label: 'Incidents critiques manqués / mois', value: '−80 %' },
      { label: 'Filtres personnels devenus vues d’équipe', value: '12 → 4 partagées' },
      { label: 'Agents utilisant la vue quotidiennement', value: '9 / 9' },
    ],
    closing:
      "Les fichiers de filtres personnels ont disparu d'eux-mêmes : la méthode que chaque agent avait bricolée seul est devenue l'outil par défaut de toute l'équipe.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((project) => project.slug === slug);
}
