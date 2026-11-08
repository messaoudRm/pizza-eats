import { Cart } from "../../domain/entities/Cart";
import { Pizza } from "../../domain/entities/Pizza";

export class CartService {
    private readonly cart = new Cart();

    getItems() {
        return this.cart.getItems();
    }

    addItem(pizza: Pizza, quantity: number, size: string): void {
        this.cart.addItem(pizza, quantity, size);
    }

    removeItem(pizzaId: string, size: string): void {
        this.cart.removeItem(pizzaId, size);
    }

    updateSize(pizzaId: string, oldSize: string, newSize: string): void {
        this.cart.updateSize(pizzaId, oldSize, newSize);
    }

    undo(): boolean {
        return this.cart.undo();
    }

    redo(): boolean {
        return this.cart.redo();
    }
}