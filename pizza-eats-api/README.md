# 🍕 Pizza Eats API

## Présentation

**Pizza Eats API** est le backend de la marketplace multi-enseignes Pizza Eats.

Cette API centralise la logique métier et assure la communication entre l'interface utilisateur Angular et la base de données PostgreSQL.

Elle permet notamment de gérer les utilisateurs, les restaurants, les menus, les commandes et les livraisons.

## Architecture

L'API repose sur une architecture **DDD (Domain-Driven Design)**, organisée en plusieurs couches afin de séparer les responsabilités et de faciliter la maintenance et l'évolution du projet.

```text
src/
│
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── value-objects/
│
├── application/
│   └── use-cases/
│
├── infrastructure/
│   ├── database/
│   └── repositories/
│
├── presentation/
│   ├── routes/
│   └── controllers/
│
├── config/
│
├── app.ts
└── server.ts
```

### Domain

Contient les entités métier, les objets de valeur, les règles métier et les interfaces des repositories.

### Application

Contient les cas d'utilisation qui orchestrent les opérations métier de l'application.

### Infrastructure

Contient les implémentations techniques, l'accès à la base de données et les repositories.

### Presentation

Contient les routes HTTP et les controllers qui gèrent les requêtes et les réponses de l'API.

### Config

Centralise la configuration de l'application et les variables d'environnement.

## Technologies

| Technologie | Utilisation |
|---|---|
| Fastify | Framework backend HTTP |
| TypeScript | Langage de programmation |
| PostgreSQL | Base de données relationnelle |
| Prisma | ORM et accès aux données |
| Zod | Validation des données |
| Docker | Conteneurisation |

## Démarrage

L'API est conçue pour être exécutée dans un conteneur Docker, orchestré depuis le fichier `docker-compose.yml` situé à la racine du repository.

Le démarrage de l'ensemble de l'application se fait depuis la racine du projet :

```bash
docker compose up --build
```

## Tests

Les tests seront organisés dans le dossier `tests/`, avec une séparation entre les tests unitaires et les tests d'intégration.

