import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class PizzaHut extends Brand {
    constructor() {
        const menu = [
            new Pizza("ph-1", "Margherita", "Tomate, mozzarella et basilic", 13),
            new Pizza("ph-2", "Cheese Lovers", "Mozzarella, cheddar et fromage fondu", 16),
        ];

        super("pizza-hut", "Pizza Hut", menu);
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 1.2);
    }
}