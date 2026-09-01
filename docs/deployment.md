# Déploiement — VPS Hostinger

Stack : Docker Compose (`web`, `api`, `postgres`, `caddy`) sur un unique VPS.
Caddy gère le TLS automatique (Let's Encrypt) pour :

- `alexandregiraud.tech` / `www.alexandregiraud.tech` → `web`
- `api.alexandregiraud.tech` → `api`

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

Attendre la propagation avant de démarrer Caddy (sinon la demande de
certificat Let's Encrypt échoue).

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

`.github/workflows/ci.yml` contient un job `deploy` qui, sur `main`, une fois
`verify` et `e2e` verts, se connecte en SSH et relance la stack :

```bash
cd /opt/portfolio-platform && git pull
docker compose -f infra/compose.prod.yaml up -d --build
docker compose -f infra/compose.prod.yaml exec -T api node_modules/.bin/prisma migrate deploy
```

Le job est **désactivé par défaut** (variable de repo `DEPLOY_ENABLED`) tant
que les secrets ci-dessous ne sont pas configurés.

### Secrets et variable à configurer (dans le repo GitHub)

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

## 5. Sauvegardes

`postgres-data` est un volume Docker nommé — inclure `docker run --rm -v
portfolio-prod_postgres-data:/data -v $PWD:/backup alpine tar czf
/backup/pg-backup.tar.gz /data` dans une tâche planifiée (cron) régulière.
