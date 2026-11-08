import { CartService } from "../../application/services/CartService";
import { Pizza } from "../../domain/entities/Pizza";

export class CartController {
    constructor(private readonly cartService: CartService) {}

    getItems() {
        return this.cartService.getItems();
    }

    addItem(pizza: Pizza, quantity: number, size: string) {
        this.cartService.addItem(pizza, quantity, size);
        return {
            success: true,
            message: "Pizza ajoutée au panier",
        };
    }

    removeItem(pizzaId: string, size: string) {
        this.cartService.removeItem(pizzaId, size);
        return {
            success: true,
            message: "Pizza supprimée du panier",
        };
    }

    updateSize(pizzaId: string, oldSize: string, newSize: string) {
        this.cartService.updateSize(pizzaId, oldSize, newSize);
        return {
            success: true,
            message: "Taille de la pizza modifiée",
        };
    }

    undo() {
        const success = this.cartService.undo();
        return {
            success,
            message: success
                ? "Dernière modification annulée"
                : "Aucune modification à annuler",
        };
    }

    redo() {
        const success = this.cartService.redo();
        return {
            success,
            message: success
                ? "Modification rétablie"
                : "Aucune modification à rétablir",
        };
    }
}