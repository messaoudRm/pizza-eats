import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class DominosPizza extends Brand {
    constructor() {
        const menu = [
            new Pizza("dp-1", "Margherita", "Tomate, mozzarella et basilic", 12),
            new Pizza("dp-2", "Pepperoni", "Tomate, mozzarella et pepperoni", 14),
        ];

        super("dominos-pizza", "Domino's Pizza", menu);
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 1.15);
    }
}