import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class Pizzium extends Brand {
    constructor() {
        const menu = [
            new Pizza("pz-1", "Margherita", "Tomate, mozzarella et basilic", 9),
            new Pizza("pz-2", "Bufalina", "Tomate, mozzarella di bufala et basilic", 13),
        ];

        super("pizzium", "Pizzium", menu);
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 0.9);
    }
}