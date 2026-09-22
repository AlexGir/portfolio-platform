# Déploiement — VPS Hostinger

Stack : Docker Compose (`web`, `api`, `postgres`) sur un VPS qui héberge déjà
d'autres services (ex. `n8n`) derrière un **Traefik partagé** existant
(`network_mode: host`, découverte par labels Docker, cert resolver
`letsencrypt`). Cette stack **ne lance pas son propre reverse proxy** — `web`
et `api` portent juste les labels Traefik nécessaires, exactement comme les
autres projets sur ce VPS :

- `alexandregiraud.tech` / `www.alexandregiraud.tech` → `web` (label sur le
  service `web` dans `infra/compose.prod.yaml`)
- `api.alexandregiraud.tech` → `api` (label sur le service `api`)

Si un jour ce projet tourne seul sur son propre VPS (sans Traefik déjà en
place), il faudrait réintroduire un reverse proxy dédié (Caddy ou Traefik) —
ce n'est pas le cas ici.

Les images sont **construites directement sur le VPS** à chaque déploiement
(pas de registry) — adapté à un seul serveur personnel. Un registry (GHCR)
pourra être ajouté plus tard si plusieurs environnements apparaissent.

## 1. Préparer le VPS (une seule fois)

```bash
# Docker + Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # puis se reconnecter

# Pare-feu : n'ouvrir que SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable
```

## 2. DNS

Chez le registrar de `alexandregiraud.tech`, créer des enregistrements A (et
AAAA si IPv6) pointant vers l'IP du VPS :

| Type | Nom   | Valeur    |
| ---- | ----- | --------- |
| A    | `@`   | IP du VPS |
| A    | `www` | IP du VPS |
| A    | `api` | IP du VPS |

Attendre la propagation avant le premier déploiement (sinon la demande de
certificat Let's Encrypt par Traefik échoue).

## 3. Premier déploiement (manuel)

```bash
git clone https://github.com/AlexGir/portfolio-platform.git /opt/portfolio-platform
cd /opt/portfolio-platform/infra
cp prod.env.example .env
$EDITOR .env   # renseigner POSTGRES_PASSWORD, JWT_*, GITHUB_*/GOOGLE_* (créer les apps OAuth
               # avec comme callback https://api.alexandregiraud.tech/auth/{provider}/callback)

cd /opt/portfolio-platform
docker compose -f infra/compose.prod.yaml up -d --build
docker compose -f infra/compose.prod.yaml exec api node_modules/.bin/prisma migrate deploy
```

Vérifier : `https://alexandregiraud.tech` (portfolio) et
`https://api.alexandregiraud.tech/health` (`{"status":"ok", ...}`).

## 4. Déploiements suivants (automatiques via CI)

**Actif depuis le 2026-09-22.** `.github/workflows/ci.yml` contient un job
`deploy` qui, sur `main`, une fois `verify`, `e2e` et `docker-build` verts, se
connecte en SSH et relance la stack :

```bash
cd /opt/portfolio-platform
git fetch origin main && git reset --hard origin/main
docker compose -f infra/compose.prod.yaml up -d --build
docker compose -f infra/compose.prod.yaml exec -T api node_modules/.bin/prisma migrate deploy
```

Le job ne s'exécute que si la variable de repo `DEPLOY_ENABLED` vaut `true`
et que les 3 secrets ci-dessous sont configurés — c'est le cas.

### Secrets et variable configurés (dans le repo GitHub)

```bash
gh secret set HOSTINGER_HOST --body "<ip-ou-domaine-du-vps>"
gh secret set HOSTINGER_USER --body "<utilisateur-ssh>"
gh secret set HOSTINGER_SSH_KEY < ~/.ssh/id_ed25519   # clé privée dédiée au déploiement
gh variable set DEPLOY_ENABLED --body "true"
```

Génère une paire de clés dédiée (`ssh-keygen -t ed25519 -f deploy_key`),
ajoute la **publique** dans `~/.ssh/authorized_keys` sur le VPS, et donne la
**privée** à `HOSTINGER_SSH_KEY` — jamais l'inverse, et jamais ta clé
personnelle.

## 5. Formulaire de contact (Resend)

Le formulaire de la section Contact envoie un mail via l'API Resend. Tant que
les trois variables ci-dessous ne sont pas renseignées, `POST /contact` répond
**503** et le formulaire web affiche un repli vers l'adresse e-mail directe —
le reste de l'API n'est pas affecté.

1. Créer un compte sur [resend.com](https://resend.com) (offre gratuite :
   3 000 mails/mois).
2. Ajouter le domaine `alexandregiraud.tech` et créer les enregistrements DNS
   que Resend indique (un `MX` et deux `TXT` : SPF et DKIM) chez le registrar.
   Attendre que le domaine passe en « Verified ».
3. Créer une clé API (droit d'envoi uniquement).
4. Renseigner dans `/opt/portfolio-platform/infra/.env` :

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=contact@alexandregiraud.tech
CONTACT_TO_EMAIL=alexandre.giraud1995@gmail.com
```

5. Redémarrer l'API : `docker compose -f infra/compose.prod.yaml up -d api`

`CONTACT_FROM_EMAIL` **doit** être sur le domaine vérifié. L'adresse du
visiteur part en `reply_to`, jamais en expéditeur : envoyer au nom d'un domaine
qu'on ne contrôle pas ferait échouer SPF/DKIM et finirait en spam.

Vérifier une fois en production :

```bash
curl -i -X POST https://api.alexandregiraud.tech/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"moi@example.com","message":"Message de test du formulaire de contact."}'
```

Réponse attendue : `202` avec `{"status":"sent"}`, et le mail dans la boîte de
réception. Le point d'entrée est limité à **5 messages par heure et par IP**.

## 6. Sauvegardes

`postgres-data` est un volume Docker nommé — inclure `docker run --rm -v
portfolio-prod_postgres-data:/data -v $PWD:/backup alpine tar czf
/backup/pg-backup.tar.gz /data` dans une tâche planifiée (cron) régulière.
