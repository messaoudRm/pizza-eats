# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clients qui commandent une pizza en livraison à Paris : ils se connectent avec leur email, choisissent une enseigne, composent leur panier, appliquent une réduction, valident, paient et suivent leur commande.

Contexte : projet académique (B-School). L'interface sert à démontrer l'API `pizza-eats-api` et ses design patterns devant un correcteur.

## Product Purpose

Interface de commande inspirée d'UberEats qui consomme tous les endpoints de `pizza-eats-api`. Le succès : chaque endpoint est utilisé par une page ou une action, et le parcours complet (login → commande → paiement → suivi) fonctionne de bout en bout.

## Capabilities and Constraints

- Login par email uniquement, sans mot de passe (pas d'endpoint d'authentification : l'email est conservé côté client).
- Les prix, réductions et totaux viennent de l'API ; le front ne les recalcule pas.
- Un panier unique côté serveur ; une seule enseigne par commande.
- Pas de « −1 » sur une quantité : l'API permet d'ajouter un exemplaire ou de supprimer la ligne.
- Commande refusée hors horaires d'ouverture ; un bouton permet de simuler une heure d'ouverture pour la démo.
- Angular 22, composants standalone, SCSS simple, aucune librairie UI.

## Evidence on Hand

- Photos de pizzas libres de droits (Wikimedia Commons) dans `public/images/`, crédits dans `public/images/CREDITS.md`.
- Aucun logo d'enseigne, aucun avis client, aucune note : ne pas en inventer.

## Product Principles

- Le parcours de commande avant tout : chaque écran mène à l'étape suivante.
- Montrer les règles de l'API telles qu'elles sont (erreurs, refus) avec un message clair.
- Simplicité du code : architecture lisible pour un correcteur.

<!-- Rédigé à partir du brief de l'utilisateur ("fais ce qui te semble le mieux"), sans entretien séparé. -->
