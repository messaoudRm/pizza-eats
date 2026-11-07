import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class Pizzium extends Brand {
    constructor() {
        const menu = [
            new Pizza(
                "pz-1",
                "Margherita",
                "Tomate, mozzarella et basilic",
                9,
                10,
            ),
            new Pizza(
                "pz-2",
                "Bufalina",
                "Tomate, mozzarella di bufala et basilic",
                13,
                7,
            ),
        ];

        super("pizzium", "Pizzium", menu, [8, 9, 10], {
            // ouverture Mardi–Samedi	11h45–14h15 / 18h45–22h00
            0: [],
            1: [],
            2: [
                { open: "11:45", close: "14:15" },
                { open: "18:45", close: "22:00" },
            ],
            3: [
                { open: "11:45", close: "14:15" },
                { open: "18:45", close: "22:00" },
            ],
            4: [
                { open: "11:45", close: "14:15" },
                { open: "18:45", close: "22:00" },
            ],
            5: [
                { open: "11:45", close: "14:15" },
                { open: "18:45", close: "22:00" },
            ],
            6: [
                { open: "11:45", close: "14:15" },
                { open: "18:45", close: "22:00" },
            ],
        });
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 0.9);
    }
}