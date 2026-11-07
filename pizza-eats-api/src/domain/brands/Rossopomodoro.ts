import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class Rossopomodoro extends Brand {
    constructor() {
        const menu = [
            new Pizza("rp-1", "Margherita", "Tomate, mozzarella et basilic", 11),
            new Pizza("rp-2", "Diavola", "Tomate, mozzarella et salami piquant", 12),
        ];

        super("rossopomodoro", "Rossopomodoro", menu);
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 1.1);
    }
}