# US6 – Annuler / rétablir les modifications du panier : pattern Memento

## Le problème

> Comment sauvegarder l'état d'un objet pour pouvoir le restaurer plus tard, sans exposer ses détails internes ?

Le client doit pouvoir annuler (undo) et rétablir (redo) ses 10 dernières modifications du panier : ajout, suppression, changement de taille.

Il faut donc garder des « photos » successives du contenu du panier. Mais la liste des articles (`items`) est **privée** dans `Cart` : aucune autre classe ne doit pouvoir la lire ou la modifier directement.

## Pourquoi le Memento

Le **Memento** est le pattern qui répond exactement à cette question :

- **Sauvegarder un état** : avant chaque modification, le panier crée un memento, c'est-à-dire une copie de ses articles à cet instant.
- **Le restaurer plus tard** : lors d'un undo ou d'un redo, le panier reprend l'état contenu dans un memento.
- **Sans exposer ses détails internes** : c'est le panier lui-même qui crée et relit ses mementos. La classe qui stocke l'historique ne connaît pas le contenu du panier : elle se contente d'empiler et de dépiler des mementos.

Avantages :

- `Cart` garde son encapsulation : `items` reste privé.
- La gestion de l'historique (piles undo/redo, limite de 10) est séparée du panier : chaque classe a une seule responsabilité.
- Un memento contient une **copie** des articles : modifier le panier ensuite ne modifie pas les états sauvegardés.

## Le rôle de chaque classe

| Rôle Memento | Classe | Rôle dans le projet |
|---|---|---|
| **Originator** | `src/domain/entities/Cart.ts` | Le panier. Il crée un memento de son état avant chaque modification (`saveState()`) et se restaure à partir d'un memento (`restore()`). |
| **Memento** | `src/domain/entities/CartMemento.ts` | Une photo du panier à un instant donné : une copie des articles (pizza, quantité, taille). |
| **Caretaker** | `src/domain/entities/CartHistory.ts` | Garde l'historique : une pile undo et une pile redo, limitées aux 10 dernières modifications. Il ne lit jamais le contenu des mementos. |

## Déroulement

1. **Modification** (`addItem`, `removeItem`, `updateSize`) : `Cart` crée un `CartMemento` de son état actuel et le donne à `CartHistory`, qui l'empile dans la pile undo (au-delà de 10, le plus ancien est supprimé) et vide la pile redo.
2. **Undo** : `CartHistory` empile l'état actuel dans la pile redo et renvoie le dernier memento de la pile undo, que `Cart` restaure.
3. **Redo** : `CartHistory` empile l'état actuel dans la pile undo et renvoie le dernier memento de la pile redo, que `Cart` restaure.

Routes exposées : `POST /cart/undo` et `POST /cart/redo`.
