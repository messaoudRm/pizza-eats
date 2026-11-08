import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class Rossopomodoro extends Brand {
    constructor() {
        const menu = [
            new Pizza(
                "rp-1",
                "Margherita",
                "Tomate, mozzarella et basilic",
                11,
                12,
            ),
            new Pizza(
                "rp-2",
                "Diavola",
                "Tomate, mozzarella et salami piquant",
                12,
                6,
            ),
        ];

        super("rossopomodoro", "Rossopomodoro", menu, [4, 5, 6], {
            // ouverture  Lundi–Samedi	12h00–15h00 / 19h00–23h00
            0: [],
            1: [
                { open: "12:00", close: "15:00" },
                { open: "19:00", close: "23:00" },
            ],
            2: [
                { open: "12:00", close: "15:00" },
                { open: "19:00", close: "23:00" },
            ],
            3: [
                { open: "12:00", close: "15:00" },
                { open: "19:00", close: "23:00" },
            ],
            4: [
                { open: "12:00", close: "15:00" },
                { open: "19:00", close: "23:00" },
            ],
            5: [
                { open: "12:00", close: "15:00" },
                { open: "19:00", close: "23:00" },
            ],
            6: [
                { open: "12:00", close: "15:00" },
                { open: "19:00", close: "23:00" },
            ],
        }, { S: 0.85, M: 1.1, L: 1.35, XL: 1.7 });
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 1.1);
    }
}