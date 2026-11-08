# 🍕 Pizza Eats

**Pizza Eats** est une marketplace multi-enseignes dédiée à la commande et à la livraison de pizzas.

La plateforme permet aux clients de découvrir différentes pizzerias et chaînes de restauration, consulter leurs menus, passer des commandes et suivre leurs livraisons depuis une seule application.

## Architecture du projet

Le projet est composé de deux services orchestrés avec Docker Compose.

| Service | Technologie | Port | Description |
|---|---|---|---|
| `pizza-eats-ui` | Angular 22 | 4200 | Interface utilisateur |
| `pizza-eats-api` | TypeScript (Fastify) | 3000 | API backend |

Il n'y a pas de base de données : l'API garde ses données en mémoire (panier, commandes, stock). **Elles sont remises à zéro à chaque redémarrage de l'API.**

Dans Docker, l'interface appelle l'API via `/api/...` : le serveur Angular redirige ces appels vers le conteneur `pizza-eats-api` par le réseau Docker. L'interface attend que l'API soit prête (healthcheck sur `/health`) avant de démarrer.

## Structure du repository

```text
pizza-eats/
│
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── pizza-eats-ui/
│
└── pizza-eats-api/
```

## Prérequis

- Git
- Docker
- Docker Compose

## Installation

Cloner le repository :

```bash
git clone https://github.com/messaoudRm/pizza-eats.git
```

Accéder au projet :

```bash
cd pizza-eats
```

## Configuration de l'environnement (facultatif)

Le fichier d'environnement ne sert qu'à l'envoi d'emails via EmailJS, lors d'un changement de statut de commande. **Le projet démarre sans lui.**

Pour l'activer, copier `.env.example` dans le dossier de l'API sous le nom `.env`, puis renseigner les clés EmailJS.

Sous Linux / macOS :

```bash
cp .env.example pizza-eats-api/.env
```

Sous Windows (PowerShell) :

```powershell
Copy-Item .env.example pizza-eats-api/.env
```

Sans ces clés, tout fonctionne sauf l'envoi d'email : le changement de statut d'une commande renverra une erreur.

## Démarrage du projet

Depuis la racine du projet, construire et lancer les services :

```bash
docker compose up --build -d
```

Le premier lancement prend quelques minutes (installation des dépendances). L'interface est disponible une fois qu'Angular a fini de compiler, quelques secondes après le démarrage du conteneur.

| Accès | URL |
|---|---|
| Application | http://localhost:4200 |
| API | http://localhost:3000 |
| Documentation de l'API (Swagger) | http://localhost:3000/docs |
| État de l'API | http://localhost:3000/health |

Vérifier l'état des conteneurs :

```bash
docker compose ps
```

Suivre les logs :

```bash
docker compose logs -f
```

Après une modification du code, relancer la même commande pour reconstruire les images :

```bash
docker compose up --build -d
```

Pour arrêter les services :

```bash
docker compose down
```

## Dépannage

**`address already in use` sur le port 3000 ou 4200**
Un autre programme utilise déjà ce port, souvent un `npm run dev` (API) ou un `ng serve` (UI) lancé en local. L'arrêter (Ctrl+C dans son terminal), puis relancer `docker compose up -d`.

**L'API est « healthy » mais l'interface affiche « API hors ligne »**
Le conteneur a pu être créé lors d'un lancement interrompu et n'est pas relié au réseau Docker. Recréer les conteneurs :

```bash
docker compose down
docker compose up -d
```

**Les commandes ou le panier ont disparu**
C'est normal après un redémarrage de l'API : les données sont gardées en mémoire, sans base de données.
