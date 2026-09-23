/**
 * Case study content — the single source of truth for both the homepage
 * "selected work" preview and the full `/work/[slug]` pages.
 *
 * Real work. Client names are used only where they are public (SKALES); the
 * freelance client is under NDA and stays anonymous. The design boards under
 * `/planches` are 2026 reconstructions of the original deliverables — the
 * originals belong to the clients — which is stated on every board.
 */

export type CoverVariant = 'aurora' | 'grid' | 'orbit' | 'signal';

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

/** A standalone design board (`apps/web/public/planches/…`), embedded in an iframe. */
export interface Board {
  /** Absolute path from the site root. */
  src: string;
  title: string;
  caption: string;
}

/** A decision table — the "why this option and not the others" of a case study. */
export interface DecisionTable {
  headers: string[];
  rows: string[][];
  /** Row index (0-based) to mark as the option that was chosen. */
  chosenRow?: number;
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
  table?: DecisionTable;
  boards?: Board[];
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
  /**
   * The board used as the card thumbnail — a real deliverable beats generated
   * art. Falls back to `cover` when a case study has no board yet.
   */
  coverImage?: string;
  meta: CaseStudyMeta;
  overview: {
    problem: string[];
    solution: string[];
  };
  approachIntro: string;
  methods: string[];
  /** Research deliverables, shown with the approach rather than inside a step. */
  approachBoards?: Board[];
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
    slug: 'skales-refonte-plateforme',
    title: "De l'outil d'experts à la plateforme multi-profils",
    summary:
      "Refonte UX/UI d'une plateforme SaaS B2B pensée par des ingénieurs pour des scientifiques : parcours clé réduit de 15 à 7 étapes et conversion en hausse de 17 à 20 %, validée par A/B test.",
    sector: 'SaaS B2B · recherche, santé, innovation',
    tags: ['UX Research', 'Refonte', 'Design multi-profils', 'A/B testing'],
    year: '2020-2025',
    readingTime: '7 min',
    cover: { variant: 'aurora', primary: '#005677', secondary: '#4ad746' },
    coverImage: '/planches/skales-refonte/02-personas.png',
    meta: {
      client: 'SKALES, plateforme de gestion de projets',
      role: "Responsable du design produit de l'entreprise, de l'audit (stage) au pilotage du design produit (CDI)",
      timeline: 'Septembre 2020 à mai 2025',
      whatChanged:
        'Une interface réservée à des experts devenue vendable à des clients sans bagage technique',
    },
    overview: {
      problem: [
        "SKALES édite une plateforme SaaS qui centralise la gestion des utilisateurs, des organisations, des licences et l'accès aux applications de ses clients. Elle n'avait jamais été conçue avec ses utilisateurs : parcours lents, étapes superflues, bugs générateurs de plaintes, et aucune cohérence visuelle faute de design system.",
        "Ce qui rendait la refonte urgente, c'était l'évolution de la clientèle. SKALES signait de plus en plus de clients hors du monde scientifique : secteur médical, équipes sans aucune formation technique. Une interface pensée pour des experts devenait un frein commercial. En parallèle, le périmètre explosait : gestion des droits, thèmes personnalisés, paiement et messagerie à intégrer.",
        'La question de départ : comment rendre une plateforme plus riche tout en la rendant plus simple, pour des utilisateurs de plus en plus différents les uns des autres ?',
      ],
      solution: [
        "Une refonte menée de bout en bout (audit, recherche, conception, tests) plutôt qu'un empilement de correctifs. Le parcours le plus critique a été reconstruit, l'affichage adapté au rôle de chaque utilisateur, les droits rendus lisibles, et chaque organisation a pu adopter son propre vocabulaire et sa propre identité visuelle.",
        "Au-delà des écrans, l'enjeu était d'installer une méthode UX dans une équipe qui n'en avait pas : des revues produit et des temps de réflexion UX greffés sur les rituels Scrum existants, pas un processus design parallèle.",
      ],
    },
    approachIntro:
      "Croiser ce que les gens disent et ce qu'ils font, parce que les deux divergent souvent.",
    methods: [
      'Entretiens clients et utilisateurs',
      'Questionnaires',
      'Google Analytics, funnels, heatmaps',
      'Analyse experte (Gestalt, biais cognitifs)',
      "Tests d'utilisabilité",
      'A/B testing',
      'Ateliers',
    ],
    approachBoards: [
      {
        src: '/planches/skales-refonte/01-synthese-de-la-recherche.html',
        title: 'Synthèse de la recherche',
        caption:
          "Ce que les entretiens, les questionnaires et les données d'usage ont fait remonter, et ce que chaque constat impliquait pour la refonte.",
      },
      {
        src: '/planches/skales-refonte/02-personas.html',
        title: 'Personas',
        caption:
          "Quatre profils construits à partir des entretiens. Le coordinateur non scientifique incarne la nouvelle clientèle qui a rendu la refonte nécessaire : c'est lui le persona prioritaire.",
      },
      {
        src: '/planches/skales-refonte/04-carte-experience.html',
        title: "Carte d'expérience",
        caption:
          "Le parcours de création d'un projet vécu de bout en bout, avec les points de friction là où ils faisaient vraiment décrocher.",
      },
    ],
    steps: [
      {
        index: '01',
        title: "Trop d'information tuait l'usage",
        body: [
          "J'ai commencé par les clients, qui centralisaient déjà beaucoup de retours de leurs équipes, avant d'aller voir les utilisateurs finaux en entretien et par questionnaire. Pour objectiver le ressenti, j'ai analysé les parcours avec Google Analytics, des funnels et des heatmaps.",
          "Mon profil de développeur a servi dès cette étape : j'ai intégré moi-même les trackers manquants (clics, abandons, temps passé par écran) sans attendre qu'ils soient priorisés dans le backlog.",
          "Les utilisateurs se disaient souvent perdus face à la quantité de données affichée. En croisant le temps passé sur chaque écran avec le rôle de chaque utilisateur sur un projet, nous avons vérifié qu'une grande partie de l'interface ne servait qu'à certains profils. Cette corrélation a guidé toute la suite.",
        ],
        detail: {
          heading: 'Ce que le croisement a montré',
          bullets: [
            'Le ressenti « je suis perdu » correspondait à une surcharge réelle, mesurable écran par écran',
            'Une large part de chaque écran ne concernait que certains rôles du projet',
            'Les plaintes remontées par les clients et les décrochages mesurés pointaient les mêmes moments du parcours',
          ],
        },
      },
      {
        index: '02',
        title: 'Diviser par deux le parcours le plus pénible',
        body: [
          "Créer un projet opérationnel, jusqu'à une application intégrée et utilisable, était le parcours le plus critique de la plateforme. Son étape la plus pénible était l'attribution des licences : un enchaînement incompris, et aucune façon de désactiver proprement une licence une fois intégrée. Les funnels montraient précisément où les utilisateurs décrochaient.",
          "J'ai repensé le parcours de bout en bout : regrouper les étapes liées, supprimer celles que la plateforme pouvait déduire seule, rendre chaque action réversible, licences comprises. Les nouvelles versions ont été prototypées puis validées par A/B test avant déploiement.",
        ],
        detail: {
          heading: 'De 15 à 7 étapes',
          bullets: [
            'Regroupement des étapes qui relevaient d’une même décision',
            'Suppression de tout ce que la plateforme pouvait déduire seule',
            'Chaque action rendue réversible, y compris la désactivation d’une licence',
            'Validation par A/B test avant déploiement, puis comparaison avant/après',
          ],
        },
        boards: [
          {
            src: '/planches/skales-refonte/03-parcours-avant-apres.html',
            title: 'Parcours avant / après',
            caption:
              "Le parcours de création d'un projet, avant et après refonte. Les étapes supprimées sont celles que la plateforme pouvait déduire ou regrouper.",
          },
        ],
      },
      {
        index: '03',
        title: 'Montrer à chacun ce dont il a besoin',
        body: [
          "Face à la surcharge d'information, trois options existaient : garder l'interface complète avec des filtres, laisser chaque utilisateur personnaliser son affichage, ou adapter l'affichage au rôle.",
          "Nous avons retenu un double niveau. Par défaut, l'affichage s'adapte au rôle de l'utilisateur sur le projet. Un administrateur peut ensuite accorder facilement une visibilité supplémentaire à une personne précise, pour couvrir les cas que les rôles ne prévoient pas.",
        ],
        table: {
          headers: ['Option', 'Ce qu’elle réglait', 'Pourquoi elle ne suffisait pas'],
          rows: [
            [
              'Interface complète + filtres',
              'Aucun développement structurant, réversible',
              "Déplace le problème : il faut déjà savoir quoi filtrer pour s'y retrouver",
            ],
            [
              'Personnalisation libre par utilisateur',
              'Chacun obtient exactement son écran',
              'Demande un effort de configuration que nos utilisateurs ne feraient pas',
            ],
            [
              "Affichage adapté au rôle, ajustable par l'admin",
              'Le bon écran par défaut, sans effort, avec une soupape pour les cas particuliers',
              'Sans objet',
            ],
          ],
          chosenRow: 2,
        },
      },
      {
        index: '04',
        title: 'Rendre les droits compréhensibles',
        body: [
          "La gestion des droits ralentissait la mise en place d'un projet de bout en bout. J'ai proposé des profils de droits prêts à l'emploi (utilisateur, manager, administrateur…) couvrant la majorité des besoins, puis une interface dédiée pour modifier un profil ou ajuster les droits d'un utilisateur précis. Un manager peut régler une sous-sélection de droits pour les membres de son projet, sur ce projet uniquement, sans toucher au reste de l'organisation.",
          "L'interface regroupe les droits par familles repliables (principe de proximité de la Gestalt) pour cocher ou décocher un ensemble rapidement. J'ai surtout tenu à ce que chaque droit soit formulé simplement et que ses conséquences pour l'utilisateur concerné soient explicites avant validation.",
        ],
        boards: [
          {
            src: '/planches/skales-refonte/05-roles-et-droits.html',
            title: 'Rôles et droits',
            caption:
              "Les profils prêts à l'emploi, l'ajustement fin par utilisateur, et la formulation de chaque droit avec sa conséquence explicite avant validation.",
          },
        ],
      },
      {
        index: '05',
        title: 'Laisser chaque client parler sa propre langue',
        body: [
          "En échangeant avec les clients, un collègue et moi avons repéré une série de tickets similaires : le vocabulaire de la plateforme ne correspondait pas à celui de leur métier. Imposer un lexique neutre unique n'aurait satisfait personne.",
          "Nous avons comparé le temps passé à traiter ces tickets avec le coût d'une fonctionnalité de labels personnalisables. Le moment était idéal : la refonte et la personnalisation des thèmes touchaient déjà la base de données. Chaque organisation a ainsi pu adapter ses libellés, importer ses propres langues, et appliquer son identité visuelle.",
          "Les thèmes servaient aussi l'accessibilité, en proposant des variantes adaptées au daltonisme et à d'autres troubles visuels.",
        ],
        detail: {
          heading: 'Argumenter le design en coût, pas en confort',
          bullets: [
            "Le design n'était pas le poste prioritaire d'une startup : chaque chantier devait se justifier",
            "J'ai appris à chiffrer le temps perdu en support et les opportunités commerciales freinées",
            'Cet argumentaire a débloqué plusieurs décisions, dont celle-ci',
          ],
        },
      },
    ],
    reflection: {
      label: "Ce que j'en retiens",
      text: "Une méthode doit survivre à celui qui la porte. J'ai installé des revues produit et des réflexes UX dans l'équipe, mais ils reposaient beaucoup sur ma présence. C'est la leçon que j'ai le plus appliquée depuis : en freelance comme sur mes projets, je documente systématiquement recherches, décisions et rituels pour qu'ils restent transmissibles.",
    },
    impact: [
      { label: 'Étapes du parcours critique', value: '15 → 7' },
      { label: "Taux d'abandon", value: '≈ −25 % (relatif)' },
      { label: 'Projets menés jusqu’à une app utilisable', value: '+17 à 20 %' },
      { label: 'Méthode de validation', value: 'A/B test + avant/après' },
    ],
    closing:
      "La plateforme est devenue utilisable, et donc vendable, à des clients sans bagage scientifique. Les plaintes et les sollicitations du support ont diminué, et l'équipe produisait de nouveaux écrans plus vite, avec moins d'allers-retours entre design et développement.",
  },
  {
    slug: 'skales-design-system',
    title: "Un seul système, autant d'identités que de clients",
    summary:
      "Création du design system et de la bibliothèque de composants de tout l'écosystème SKALES : ~200 composants, de Figma jusqu'au code, capables d'afficher l'identité visuelle de chaque client sans toucher un seul composant.",
    sector: 'Design system · bibliothèque React',
    tags: ['Design system', 'Theming', 'Accessibilité', 'Développement React'],
    year: '2020-2025',
    readingTime: '6 min',
    cover: { variant: 'grid', primary: '#005677', secondary: '#00b908' },
    coverImage: '/planches/skales-design-system/01-fondations.png',
    meta: {
      client: 'SKALES : plateforme, add-ons, apps clientes, outils low-code',
      role: 'Initiateur et responsable du design system, co-développeur de la bibliothèque React',
      timeline: 'Design system fin 2020, bibliothèque dès 2021',
      whatChanged:
        'Des composants réécrits par chaque application devenus un socle unique, thématisable par client',
    },
    overview: {
      problem: [
        "Chaque application SKALES recodait ses propres boutons, formulaires et tableaux, avec leurs petites différences et leurs bugs. Le même bouton existait en plusieurs versions, et chaque correction devait être répliquée partout, quand elle l'était.",
        "Le symptôme le plus parlant concernait les états. Des boutons censés être désactivés ne l'affichaient pas : ni grisés, ni masqués, ils invitaient à cliquer sur une action impossible. Rien de grave pour la sécurité, mais une source constante de confusion et de tickets.",
      ],
      solution: [
        "Un design system dont tout part de décisions élémentaires nommées : les design tokens. Les composants ne contiennent aucune valeur en dur : changer de thème revient à changer les tokens, jamais les composants. C'est ce qui a rendu possible l'affichage de l'identité de chaque client, et des thèmes adaptés aux troubles visuels.",
        "Un design system est un produit à part entière, avec ses propres utilisateurs. Pour ceux qui construisent, développeurs et designer, la promesse était la vitesse et la fiabilité. Pour ceux qui en bénéficient, utilisateurs finaux et clients, la cohérence et l'appropriation.",
      ],
    },
    approachIntro:
      'Traiter le design system comme un produit : deux publics, deux promesses, et une gouvernance qui tient dans la durée.',
    methods: [
      'Audit des composants existants',
      'Benchmark de fondations techniques',
      'Design tokens',
      'Figma + Storybook',
      'Développement React',
      'Contrastes WCAG',
    ],
    steps: [
      {
        index: '01',
        title: 'Choisir la fondation en raisonnant en coût de production',
        body: [
          "Nous avons retenu Material UI après l'avoir comparé à ses deux vrais concurrents sur le rendu visuel obtenu et le coût de production réel. Trois développeurs pour environ 200 composants : chaque heure d'implémentation comptait.",
          "L'argument décisif était la thématisation : Material UI permet de changer tout le thème à l'exécution. C'était exactement ce qu'il fallait pour afficher l'identité de chaque client et proposer des thèmes adaptés aux troubles visuels. Son principal défaut, un style très reconnaissable, se corrigeait justement par nos propres tokens. Chakra UI a aussi été testé, puis écarté : son écosystème était encore restreint à l'époque.",
        ],
        table: {
          headers: ['Option', 'Atout', 'Limite pour notre cas'],
          rows: [
            [
              'HTML/CSS natif',
              'Liberté visuelle totale',
              'Tout à reconstruire : états, accessibilité, navigation clavier. Coût intenable à trois',
            ],
            [
              'Bootstrap',
              'Connu de tous, rapide à démarrer',
              'Rendu daté et reconnaissable, thématisation profonde laborieuse',
            ],
            [
              'Material UI',
              'Thématisation dynamique, accessibilité intégrée, composants riches (tableaux, sélecteurs de date)',
              'Look « Material » à neutraliser, surcharges de style parfois verbeuses',
            ],
          ],
          chosenRow: 2,
        },
      },
      {
        index: '02',
        title: 'Des tokens avant les composants',
        body: [
          'Tout part de décisions élémentaires nommées : couleurs, typographie, espacements, rayons, états. Les composants ne contiennent aucune valeur en dur, donc changer de thème ne touche jamais un composant.',
          "La palette d'origine posait un vrai problème d'accessibilité : le vert de la marque n'a qu'un contraste de 1,89:1 avec du texte blanc, loin des 4,5:1 requis. Plutôt que de le retirer, je lui ai donné un rôle où il fonctionne (accent sur fond sombre, à 7,98:1) et confié les actions principales au bleu pétrole, à 8,08:1. L'identité est préservée, les contrastes sont conformes.",
          "Côté typographie, les clients choisissaient leur police parmi les Google Fonts : le système fixait donc l'échelle et les graisses, pas la famille. Inter par défaut pour l'interface, pour sa lisibilité en petite taille et ses chiffres tabulaires dans les tableaux, et Manrope pour les titres.",
        ],
        detail: {
          heading: 'Répartition des rôles de couleur',
          bullets: [
            'Action principale : Bleu 700, texte blanc (8,08:1)',
            'Accent et mise en avant : Vert 400, texte Neutre 900 (7,98:1)',
            'Texte principal : Neutre 900 sur Neutre 100 (13,30:1)',
            'Erreur : 5,62:1 · Avertissement : 4,67:1, tous vérifiés selon les WCAG',
          ],
        },
        boards: [
          {
            src: '/planches/skales-design-system/01-fondations.html',
            title: 'Fondations',
            caption:
              "Palette complète en dix paliers, rôles de couleur avec leur ratio de contraste, échelle typographique et grille d'espacement de 4 px.",
          },
          {
            src: '/planches/skales-design-system/02-theming.html',
            title: 'Theming',
            caption:
              'Le même écran sous plusieurs thèmes client, et les variantes pensées pour le daltonisme, obtenues en changeant les tokens, jamais les composants.',
          },
        ],
      },
      {
        index: '03',
        title: 'Des états définis une fois pour toutes',
        body: [
          "Chaque composant interactif spécifie les mêmes états : par défaut, survol, focus, actif, désactivé, chargement, erreur. Le bug des boutons désactivés ne pouvait plus se reproduire, puisque l'état n'était plus redéfini application par application.",
          "Le même raisonnement s'applique à la validation des saisies : quand annoncer une erreur, comment la formuler, et ce que l'utilisateur doit pouvoir faire ensuite. Ces règles vivent dans le système, pas dans la tête de chaque développeur.",
        ],
        boards: [
          {
            src: '/planches/skales-design-system/03-button-et-input.html',
            title: 'Button et Input',
            caption:
              'Les variantes et les sept états spécifiés pour les deux composants les plus utilisés du système, avec leurs cotes et leurs tokens.',
          },
          {
            src: '/planches/skales-design-system/04-validation-des-saisies.html',
            title: 'Validation des saisies',
            caption:
              "Quand une erreur apparaît, comment elle est formulée, et ce que l'utilisateur peut faire ensuite : tout est spécifié au niveau du système.",
          },
        ],
      },
      {
        index: '04',
        title: 'Faire vivre le système, et le développer moi-même',
        body: [
          "Un design system ne vaut que s'il reste la source de vérité. J'ai conçu sa documentation pour qu'un composant Figma et son équivalent codé soient strictement identiques : Storybook côté code, et pour chaque composant une fiche détaillée avec cotes, typographies, couleurs et variantes d'états. Tout nouveau besoin client suivait le même chemin, sans raccourci : prototype, validation, intégration Figma + Storybook, mise en production.",
          "Participer moi-même au développement React, aux côtés de deux développeurs, a été déterminant. Je concevais en connaissant le coût de chaque choix, et la fidélité entre maquette et produit ne dépendait pas d'une traduction approximative. Quelques développeurs trouvaient au début le processus plus long ; la stabilité obtenue les a rapidement convaincus.",
        ],
        detail: {
          heading: 'La gouvernance en quatre temps',
          bullets: [
            'Nouveau besoin client identifié',
            'Prototype et validation',
            'Intégration simultanée dans Figma et Storybook',
            'Mise en production sur les applications',
          ],
        },
      },
    ],
    reflection: {
      label: "Ce que j'en retiens",
      text: "Poser une référence avant de changer. Les gains étaient évidents pour l'équipe, mais difficiles à chiffrer : le coût des tickets liés à l'interface n'avait jamais été suivi avant le projet. Aujourd'hui, je mettrais en place dès le lancement quelques indicateurs simples (tickets d'interface, temps de livraison d'un écran, taux de réutilisation) pour pouvoir démontrer la valeur du système, et pas seulement la constater.",
    },
    impact: [
      { label: 'Composants du système', value: '≈ 200' },
      { label: 'Produits SKALES couverts', value: 'La totalité' },
      { label: 'Vitesse sur les applications complexes', value: '×2 à ×2,5' },
      { label: 'Temps récupéré par développeur', value: '≈ ½ journée / semaine' },
    ],
    closing:
      "Au lancement, le gain sur la production d'un écran n'était que d'environ 5 %, insuffisant pour rentabiliser l'effort de construction. Une fois le système et la bibliothèque arrivés à maturité, nous produisions des applications complexes 2 à 2,5 fois plus vite que nos concurrents, un constat partagé par plusieurs clients.",
  },
  {
    slug: 'marketplace-closers',
    title: "Concevoir une marketplace avant qu'elle n'existe",
    summary:
      "Mission freelance pour une start-up en pré-lancement : démarche UX complète, de la proposition de valeur aux prototypes testés, avec l'IA comme accélérateur de production. Mission reconduite.",
    sector: 'Marketplace à deux faces · pré-lancement',
    tags: ['Product Discovery', 'Benchmark', "Tests d'utilisabilité", 'Design system', 'IA'],
    year: '2026',
    readingTime: '6 min',
    cover: { variant: 'orbit', primary: '#b8451f', secondary: '#e8b34a' },
    coverImage: '/planches/marketplace-closers/05-matchmaking-mobile.png',
    meta: {
      client: 'Start-up du closing freelance (confidentiel, pré-lancement)',
      role: 'Product Designer freelance, en charge de toute la conception',
      timeline: 'Deux phases de trois mois en 2026, reconduite après la première',
      whatChanged:
        'Une interface validée par des tests avant le lancement, plutôt que corrigée après',
    },
    overview: {
      problem: [
        "Pas d'interface existante, pas d'« avant » à corriger : tout était à construire, pendant que l'équipe technique développait en parallèle. La start-up met en relation des closers freelance, commerciaux spécialisés dans la conclusion de ventes, avec des entreprises qui cherchent à renforcer leurs équipes.",
        "Trois contraintes structuraient la mission. Une marketplace à deux faces, où chaque décision doit convenir à la fois aux freelances et aux entreprises. Un développement mené en parallèle de la conception. Et surtout un code généré par une plateforme d'IA alimentée directement par mes livrables : la moindre imprécision dans une maquette devenait une imprécision dans le produit.",
      ],
      solution: [
        "J'ai volontairement repoussé les maquettes. Sur un produit sans utilisateurs publics, la tentation est de dessiner tout de suite ; le risque est de soigner une interface qui répond à la mauvaise question. J'ai commencé par la stratégie (besoins couverts, modèle économique, proposition de valeur), puis le benchmark, puis les entretiens.",
        "Les maquettes sont venues ensuite, accélérées par l'IA, et sont repassées en boucle par les tests : une quinzaine de journées de tests d'utilisabilité, d'A/B testing et d'audit heuristique réparties sur les six mois.",
      ],
    },
    approachIntro:
      "Commencer par la stratégie et le marché, finir par les pixels : l'inverse du réflexe habituel sur un produit qui n'existe pas encore.",
    methods: [
      'Proposition de valeur',
      'Benchmark concurrentiel',
      'Entretiens closers et entreprises',
      '≈ 15 journées de tests',
      'A/B testing',
      'Audit heuristique',
    ],
    approachBoards: [
      {
        src: '/planches/marketplace-closers/02-proposition-de-valeur.html',
        title: 'Proposition de valeur',
        caption:
          'Ce que la plateforme promet à chacune de ses deux faces, et sur quoi repose réellement sa différenciation.',
      },
      {
        src: '/planches/marketplace-closers/04-benchmark.html',
        title: 'Benchmark concurrentiel',
        caption:
          'Trois grandes plateformes freelance, une plateforme française spécialisée et deux CRM leaders. Le constat : les plateformes savent mettre en relation, les CRM savent suivre des ventes, aucune ne fait les deux pour les closers indépendants.',
      },
      {
        src: '/planches/marketplace-closers/03-personas.html',
        title: 'Personas',
        caption:
          'Les profils des deux faces de la marketplace, construits à partir des entretiens avec de futurs utilisateurs.',
      },
    ],
    steps: [
      {
        index: '01',
        title: 'Tester un matchmaking par swipe plutôt que d’en débattre',
        body: [
          "Le matchmaking était le cœur du produit. L'idée d'un geste de swipe, emprunté aux applications de rencontre, était séduisante mais risquée dans un contexte professionnel. Plutôt que d'en débattre en réunion, j'en ai produit rapidement des prototypes visuellement aboutis grâce à l'IA, pour que la direction puisse juger sur pièce.",
          "Le swipe a ensuite été comparé en test à un matchmaking classique en liste, tout comme deux façons de trouver une mission : une barre de recherche avec filtres, ou des critères à sélectionner. Le swipe a été retenu sur mobile ; sur ordinateur, la liste reste plus adaptée à la comparaison. La recherche est restée importante, mais sur mobile les critères à sélectionner l'ont emporté, parce qu'ils sont plus accessibles qu'une saisie libre.",
        ],
        boards: [
          {
            src: '/planches/marketplace-closers/05-matchmaking-mobile.html',
            title: 'Matchmaking mobile',
            caption:
              'Le parcours de matchmaking retenu sur mobile après comparaison en test avec une présentation en liste.',
          },
        ],
      },
      {
        index: '02',
        title: 'Faire du suivi des données la raison de rester',
        body: [
          'Une plateforme de mise en relation se fait souvent quitter une fois le contrat signé. Le suivi intégré des ventes, des retours et des performances donnait aux closers une raison de revenir chaque jour.',
          "J'ai conçu ces écrans comme un outil de travail, pas comme une vitrine : le taux de closing en tête, l'indicateur que les closers citaient en premier en entretien, puis le nombre de closings, les commissions et le détail par mission.",
        ],
        boards: [
          {
            src: '/planches/marketplace-closers/06-tableau-de-bord.html',
            title: 'Tableau de bord du closer',
            caption:
              "La hiérarchie de l'écran suit l'ordre dans lequel les closers citaient leurs indicateurs en entretien, pas l'ordre dans lequel la base de données les stocke.",
          },
        ],
      },
      {
        index: '03',
        title: 'Faire du design system le contrat avec le code généré',
        body: [
          "L'équipe transformait mes livrables en code via une plateforme d'IA accessible à des profils peu techniques. Dans ce modèle, une maquette approximative produit un écran approximatif.",
          "J'ai donc construit un design system strict et accompagné chaque maquette de spécifications d'implémentation précises, pour que l'outil n'ait rien à deviner. J'ai aussi codé moi-même quelques composants très spécifiques du système.",
        ],
        detail: {
          heading: "Ce que l'IA a accéléré, et ce qu'elle n'a pas remplacé",
          bullets: [
            'Accéléré : des maquettes et prototypes testables en quelques heures au lieu de plusieurs jours',
            "Accéléré : montrer des directions visuellement fortes et comparables, au lieu de demander d'imaginer",
            "Pas remplacé : rien de ce que l'IA générait n'allait tel quel dans le produit",
            'Pas remplacé : les décisions sont restées celles de la recherche et des tests',
          ],
        },
        boards: [
          {
            src: '/planches/marketplace-closers/01-methode-designer-et-ia.html',
            title: 'Méthode designer et IA',
            caption:
              "Où l'IA intervient dans mon processus, et où elle n'intervient pas : la frontière entre production accélérée et décision de conception.",
          },
        ],
      },
    ],
    reflection: {
      label: "Ce que j'en retiens",
      text: "L'IA impressionne, la spécification décide. Un prototype généré convainc une direction en une réunion. Mais quand le produit lui-même est généré par une IA, c'est la rigueur du design system et des spécifications qui fait la qualité finale. Mon travail s'est déplacé de la production vers la définition.",
    },
    impact: [
      { label: 'Mission', value: 'Reconduite (2 × 3 mois)' },
      { label: 'Recommandations implémentées', value: "Majorité, avant l'ouverture" },
      { label: 'Journées de tests', value: '≈ 15' },
      { label: 'Périmètre', value: 'Web + mobile, deux faces' },
    ],
    closing:
      "Il n'y avait pas d'« avant » à comparer : le résultat se mesure à ce qui a été adopté. La mission a été reconduite après la première phase, la majorité des recommandations doit être livrée avant l'ouverture publique, et la direction a fait des retours très positifs sur la démarche comme sur les livrables.",
  },
  {
    slug: 'ia-et-demarche-ux',
    title: "L'IA peut-elle vraiment accélérer la démarche UX ?",
    summary:
      "Projet personnel de veille : cinq outils d'IA évalués sur des sujets comparables et cinq critères identiques, pour distinguer ce qui accélère la conception de ce qui la saute.",
    sector: 'Projet personnel · veille et méthode',
    tags: ['Veille', 'Méthode', 'IA', 'Automatisation'],
    year: '2026, en cours',
    readingTime: '4 min',
    cover: { variant: 'signal', primary: '#3b3f8f', secondary: '#b8451f' },
    meta: {
      client: 'Projet personnel de veille et d’expérimentation',
      role: 'Conception du protocole, tests, synthèse',
      timeline: 'Depuis juin 2026, en cours',
      whatChanged: 'Un positionnement outillé et argumenté, au lieu d’un avis de principe sur l’IA',
    },
    overview: {
      problem: [
        "Tous les outils d'IA promettent de « designer plus vite ». Je fais partie d'une communauté de designers UX/UI en Île-de-France, et les avis y étaient très partagés : certains gagnaient un temps fou, d'autres jugeaient les résultats inutilisables.",
        "Je voulais savoir s'ils aident vraiment à améliorer une expérience, ou s'ils produisent seulement de beaux écrans plus tôt. La question de départ : quels outils font vraiment gagner du temps, sans sacrifier la qualité de l'expérience ?",
      ],
      solution: [
        'Un protocole simple mais tenu : chaque outil reçoit le même type de mission, créer un parcours complet et crédible pour une vraie application, et est évalué sur les mêmes cinq critères.',
        "Ce qui m'intéresse d'abord, c'est la démarche UX, plus que le prototypage. Si l'IA me fait gagner du temps sur les maquettes, c'est du temps que je peux consacrer à la recherche et aux tests.",
      ],
    },
    approachIntro:
      "Comparer des outils sur des sujets comparables, avec des critères écrits d'avance, pas sur une impression après une démo.",
    methods: [
      'Protocole comparatif',
      'Critères identiques pour tous',
      'Échanges avec une communauté de designers',
      'Automatisations n8n',
    ],
    steps: [
      {
        index: '01',
        title: 'Écrire les critères avant de tester',
        body: [
          'Pour que la comparaison ait du sens, chaque outil a reçu le même type de mission et a été jugé sur les mêmes cinq critères, définis avant le premier test.',
        ],
        table: {
          headers: ['Critère', 'Ce que je regardais'],
          rows: [
            ['Rapidité', 'Le temps pour obtenir un premier résultat utilisable'],
            [
              "Qualité de l'expérience",
              'Un parcours cohérent, une hiérarchie claire, les erreurs et les cas particuliers prévus',
            ],
            ['Précision des retouches', 'Pouvoir corriger un détail sans devoir tout régénérer'],
            [
              'Cohérence et accessibilité',
              'Respecter le design system imposé, avec des contrastes et des zones cliquables accessibles',
            ],
            [
              'Passage au réel',
              'Pouvoir tester le résultat avec des utilisateurs et le transmettre à des développeurs',
            ],
          ],
        },
      },
      {
        index: '02',
        title: 'Cinq outils, un verdict par outil',
        body: [
          "Écarter Webflow, Framer et Lovable n'est pas un jugement sur leur qualité. Grâce à mon profil technique, je sais m'en servir, et ils peuvent être utiles en freelance pour livrer un produit fini. Mais je me positionne sur le product design : mon but est d'accélérer la conception, pas de la sauter.",
        ],
        table: {
          headers: ['Outil', "Type d'outil", 'Mon verdict'],
          rows: [
            [
              'Figma et ses fonctions IA',
              'Outil de design avec assistant IA',
              "Retenu : idéal pour explorer des pistes et créer des prototypes testables. Utilisé aujourd'hui en alternance avec Claude Design",
            ],
            [
              'Webflow',
              'Création de sites sans code, avec IA',
              'Très puissant, mais pensé pour livrer un site fini plus que pour concevoir',
            ],
            ['Framer', 'Création de sites sans code, avec IA', 'Même constat que pour Webflow'],
            [
              'Lovable',
              "Création d'applications à partir d'une description",
              'Plus proche du développement que du design',
            ],
            [
              'n8n',
              'Automatisation',
              'Retenu : prometteur pour vérifier la qualité des maquettes, essais en cours',
            ],
          ],
          chosenRow: 0,
        },
      },
      {
        index: '03',
        title: "Utiliser l'IA pour vérifier, pas seulement pour créer",
        body: [
          "n8n ne sert pas à créer des maquettes, et c'est ce qui le rend intéressant. Je l'utilise pour faire vérifier un lot d'écrans avant de les relire moi-même : repérer les erreurs grossières pour ne pas y passer de temps pendant la relecture, et vérifier le respect de la charte graphique quand une marque lance un nouveau produit.",
          "L'IA fait le premier tri. Mon attention reste sur les vraies questions d'expérience.",
        ],
        detail: {
          heading: 'Quatre constats, après essais et échanges avec la communauté',
          bullets: [
            "Maquetter avec l'IA reste une compétence : c'est le designer qui sait quoi demander, et quoi refuser",
            "Une maquette ne vaut rien sans test : l'IA accélère la création, pas la validation",
            "Dans de bonnes mains, l'IA change la donne : le métier se recentre sur le jugement et la méthode",
            "Il ne faut pas tout miser dessus : prix, fonctionnalités et réglementation dépendent d'entreprises privées",
          ],
        },
      },
    ],
    reflection: {
      label: "Ce que j'en retiens",
      text: 'Une façon de travailler qui reposerait entièrement sur ces outils serait fragile : ils appartiennent à des entreprises privées, les prix peuvent augmenter, des fonctionnalités disparaître, et la réglementation limiter leur usage dans certains secteurs. Je les utilise comme des accélérateurs, en gardant une méthode qui fonctionne aussi sans eux.',
    },
    impact: [
      { label: 'Outils évalués', value: '5' },
      { label: 'Critères, identiques pour tous', value: '5' },
      { label: 'Retenus dans ma pratique', value: 'Figma AI, Claude, n8n' },
      { label: 'Statut', value: 'En cours depuis juin 2026' },
    ],
    closing:
      "Ce projet prolonge ce que j'avais commencé en mission freelance et m'a permis de clarifier mon positionnement : je choisis des outils qui accélèrent la conception et aident à la vérifier. Les visuels comparatifs, un même parcours créé avec chaque outil, sont en cours de production.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((project) => project.slug === slug);
}
