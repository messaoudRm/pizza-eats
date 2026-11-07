# 🍕 Pizza Eats

**Pizza Eats** est une marketplace multi-enseignes dédiée à la commande et à la livraison de pizzas.

La plateforme permet aux clients de découvrir différentes pizzerias et chaînes de restauration, consulter leurs menus, passer des commandes et suivre leurs livraisons depuis une seule application.

## Architecture du projet

Le projet repose sur une architecture simple composée de trois services orchestrés avec Docker Compose.

| Service | Technologie | Description |
|---|---|---|
| `pizza-eats-ui` | Angular | Interface utilisateur |
| `pizza-eats-api` | TypeScript | API Backend |
| `postgres` | PostgreSQL | Base de données |

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

Se placer sur la branche de développement :

```bash
git switch develop
```

## Configuration de l'environnement

À la racine du projet, renommer le fichier `.env.example` en `.env`.

Sous Linux / macOS :

```bash
mv .env.example .env
```

Sous Windows (PowerShell) :

```powershell
Rename-Item .env.example .env
```

Le fichier `.env` contient les variables d'environnement utilisées par les différents services du projet.


## Démarrage du projet

Depuis la racine du projet, lancer l'ensemble des services avec Docker Compose :

```bash
docker compose up --build
```

Pour arrêter les services :

```bash
docker compose down
```
