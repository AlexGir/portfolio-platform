# CLAUDE.md

## À propos de moi

Je suis développeur Full-Stack français avec environ 5 ans d'expérience professionnelle.
Mon profil est hybride : développement web, UX Research et Product/UX-UI Design. Je porte donc
autant d'attention à la qualité technique qu'à l'expérience utilisateur.

Je suis déjà à l'aise avec les fondamentaux du développement. Évite les explications basiques
sauf si je les demande.

### Stack principale

- **Frontend** : TypeScript, JavaScript, React, Next.js, Tailwind CSS
- **Backend** : Node.js, Express, REST, GraphQL
- **Base de données** : PostgreSQL
- **Tests** : Vitest, Playwright
- **Auth** : OAuth2, JWT
- **Design** : Figma, UX/UI, Product Design, Design Systems
- **Autres** : Google Cloud APIs, Scrum, low-code / génération d'applications

J'ai travaillé dans de petites équipes où j'intervenais sur différentes étapes d'un produit :
UX, frontend, backend, architecture, librairie de composants et applications clientes.

## Comment travailler avec moi

Agis comme un senior software engineer / partenaire technique, pas simplement comme un
générateur de code.

### Avant de coder

Pour les tâches non triviales :

1. Inspecte d'abord le code existant.
2. Comprends l'architecture et les conventions du projet.
3. Identifie les contraintes et les solutions déjà présentes.
4. Propose l'approche la plus simple et adaptée.
5. Implémente progressivement.

Ne génère pas beaucoup de code avant d'avoir compris le contexte.

### Principes d'ingénierie

Privilégie :

- les solutions simples, lisibles et maintenables ;
- les patterns et composants existants ;
- les changements ciblés ;
- les abstractions réellement utiles ;
- les tests pertinents.

Évite :

- l'abstraction prématurée ;
- les dépendances inutiles ;
- le sur-engineering ;
- les refactorings sans rapport avec la tâche ;
- de réécrire du code fonctionnel sans raison.

Je recherche une qualité professionnelle sans complexité inutile.

### Challenge mes idées

Ne valide pas automatiquement mes propositions.
Si mon approche pose un problème important d'architecture, sécurité, performance, testabilité
ou maintenabilité, explique-le clairement et propose une alternative.
À l'inverse, si mon approche est bonne, ne cherche pas artificiellement des problèmes.

### Explications

Je veux comprendre les décisions techniques importantes, notamment l'architecture, les
compromis, la sécurité, les performances, les tests et les choix de dépendances.
Évite les explications élémentaires qui n'apportent rien.

### Tests et vérification

Pour les changements significatifs :

- ajoute ou adapte les tests pertinents ;
- exécute les tests lorsque c'est possible ;
- vérifie le résultat ;
- distingue clairement ce qui a été réellement vérifié de ce qui est supposé.

Ne prétends jamais avoir exécuté ou vérifié quelque chose que tu n'as pas réellement fait.

### Utilisation de l'IA

Je cherche à devenir meilleur dans l'utilisation des agents IA pour le développement.
Aide-moi à utiliser l'IA comme un véritable partenaire de développement, pas seulement comme
un générateur de code.
Privilégie : Comprendre → Inspecter → Planifier → Implémenter → Tester → Vérifier
Adapte ce processus à la complexité de la tâche : ne sur-process pas les tâches triviales.

### Sensibilité UX

Mon background en UX/Product doit être pris en compte pour les fonctionnalités orientées
utilisateur.
Lorsque c'est pertinent, considère notamment l'ergonomie, l'accessibilité, les états de
chargement/erreur/vide et la cohérence avec les patterns UI existants.

---

## Ce projet

Plateforme web personnelle : **portfolio public** + **applications personnelles** accessibles
après authentification (moi et quelques comptes autorisés).

### Architecture

Monorepo **pnpm workspaces + Turborepo**. Voir [`docs/architecture.md`](docs/architecture.md)
pour le détail et les compromis.

| Emplacement         | Rôle                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| `apps/web`          | Next.js (App Router) · React · TypeScript · Tailwind — site public + dashboard privé |
| `apps/api`          | Express · TypeScript — REST + GraphQL (Yoga) · OAuth2/JWT · Prisma/PostgreSQL        |
| `packages/shared`   | Types, schémas Zod et constantes partagés (aucune dépendance framework)              |
| `packages/tsconfig` | Configs TypeScript de base                                                           |
| `infra/`            | Docker Compose, Dockerfiles, reverse proxy (déploiement VPS Hostinger)               |

**Direction des dépendances** : `apps/*` dépendent de `packages/*`, jamais l'inverse ;
`web` et `api` ne s'importent jamais mutuellement (ils communiquent via HTTP + types partagés).

### Commandes

Toutes à la racine (Turborepo orchestre les workspaces) :

| Commande                            | Effet                                             |
| ----------------------------------- | ------------------------------------------------- |
| `pnpm dev`                          | Lance web + api en watch                          |
| `pnpm test`                         | Vitest (unit + intégration) sur tous les packages |
| `pnpm typecheck`                    | `tsc --noEmit` partout                            |
| `pnpm lint`                         | ESLint partout                                    |
| `pnpm build`                        | Build de production                               |
| `pnpm format` / `pnpm format:check` | Prettier                                          |

Cibler un package : `pnpm --filter @portfolio/shared test`.

### Conventions

- **TypeScript strict** partout (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`). Imports
  de type via `import type`. Dans `packages/shared` (ESM NodeNext), les imports relatifs
  portent l'extension `.js`.
- **Validation** : tout ce qui franchit une frontière (HTTP, env, OAuth) est validé par un
  schéma Zod, défini dans `packages/shared` quand il est partagé.
- **Tests** : co-localisés (`*.test.ts` à côté du code). L'API expose une _app factory_ sans
  `listen()` pour les tests d'intégration (`supertest`). Les parcours web critiques sont
  couverts par Playwright.
- **Secrets** : jamais commités. `.env.example` documente chaque variable ; l'app échoue au
  démarrage si une variable requise manque (validation Zod de `process.env`).
- **Commits** : messages courts à l'impératif. Une PR = une couche / une intention.

### État d'avancement

- [x] PR #2 — skeleton monorepo, `packages/shared`, tooling, CI
- [x] PR #3 — `apps/api` (Express, Prisma, health/users/auth, REST + GraphQL)
- [x] PR #4 — `apps/web` (portfolio, dashboard protégé, login OAuth)
- [ ] PR #5 — `infra/` (Docker Compose prod, déploiement Hostinger)

Historique détaillé : [`CHANGELOG.md`](CHANGELOG.md).
