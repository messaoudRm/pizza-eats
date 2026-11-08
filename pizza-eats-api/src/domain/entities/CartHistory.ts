import { CartMemento } from "./CartMemento";

export class CartHistory {
    private undoStack: CartMemento[] = [];
    private redoStack: CartMemento[] = [];

    save(memento: CartMemento): void {
        this.undoStack.push(memento);

        // Conserver au maximum les 10 dernières modifications
        if (this.undoStack.length > 10) {
            this.undoStack.shift();
        }

        // Une nouvelle modification invalide l'historique redo
        this.redoStack = [];
    }

    undo(current: CartMemento): CartMemento | null {
        if (this.undoStack.length === 0) {
            return null;
        }

        this.redoStack.push(current);
        return this.undoStack.pop()!;
    }

    redo(current: CartMemento): CartMemento | null {
        if (this.redoStack.length === 0) {
            return null;
        }

        this.undoStack.push(current);

        // Garder également la limite de 10 états après un redo
        if (this.undoStack.length > 10) {
            this.undoStack.shift();
        }

        return this.redoStack.pop()!;
    }
}
