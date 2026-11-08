import { CartItem } from "./CartItem";
import { Pizza } from "./Pizza";
import { CartMemento } from "./CartMemento";
import { CartHistory } from "./CartHistory";

export class Cart {
    private items: CartItem[] = [];
    private readonly history = new CartHistory();

    getItems(): CartItem[] {
        return this.items.map(
            item => new CartItem(item.pizza, item.quantity, item.size)
        );
    }

    private saveState(): void {
        this.history.save(new CartMemento(this.items));
    }

    private restore(memento: CartMemento): void {
        this.items = memento.getItems();
    }

    addItem(pizza: Pizza, quantity: number, size: string): void {
        this.saveState();

        const existingItem = this.items.find(
            item => item.pizza.id === pizza.id && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new CartItem(pizza, quantity, size));
        }
    }

    removeItem(pizzaId: string, size: string): void {
        const itemExists = this.items.some(
            item => item.pizza.id === pizzaId && item.size === size
        );

        // Ne rien sauvegarder si l'article n'existe pas
        if (!itemExists) {
            return;
        }

        this.saveState();

        this.items = this.items.filter(
            item => !(item.pizza.id === pizzaId && item.size === size)
        );
    }

    updateSize(pizzaId: string, oldSize: string, newSize: string): void {
        // Rechercher l'article correspondant à la pizza et à son ancienne taille
        const item = this.items.find(
            item => item.pizza.id === pizzaId && item.size === oldSize
        );

        // Vérifier que l'article existe dans le panier
        if (!item) {
            throw new Error("Article introuvable dans le panier.");
        }

        // Si la taille est identique à l'ancienne, aucune modification
        if (oldSize === newSize) {
            return;
        }

        // Sauvegarder l'état actuel du panier pour permettre un undo
        this.saveState();

        // Vérifier si une pizza identique existe déjà avec la nouvelle taille
        const existingItem = this.items.find(
            other =>
                other !== item &&
                other.pizza.id === pizzaId &&
                other.size === newSize
        );

        if (existingItem) {
            // Si elle existe, fusionner les quantités des deux articles
            existingItem.quantity += item.quantity;

            // Supprimer l'ancien article après la fusion
            this.items = this.items.filter(other => other !== item);
        } else {
            // Sinon, modifier simplement la taille de l'article
            item.size = newSize;
        }
    }

    undo(): boolean {
        const previous = this.history.undo(new CartMemento(this.items));

        if (!previous) return false;

        this.restore(previous);
        return true;
    }

    redo(): boolean {
        const next = this.history.redo(new CartMemento(this.items));

        if (!next) return false;

        this.restore(next);
        return true;
    }
}