import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class DominosPizza extends Brand {
    constructor() {
        const menu = [
            new Pizza(
                "dp-1",
                "Margherita",
                "Tomate, mozzarella et basilic",
                12,
                15,
            ),
            new Pizza(
                "dp-2",
                "Pepperoni",
                "Tomate, mozzarella et pepperoni",
                14,
                12,
            ),
        ];

        super("dominos-pizza", "Domino's Pizza", menu, [14, 15, 16], {
            0: [
                // ouverture Tous les jours	11h00–14h00 / 18h00–23h00
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
            1: [
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
            2: [
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
            3: [
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
            4: [
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
            5: [
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
            6: [
                { open: "11:00", close: "14:00" },
                { open: "18:00", close: "23:00" },
            ],
        });
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 1.15);
    }
}