import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class PizzaHut extends Brand {
    constructor() {
        const menu = [
            new Pizza(
                "ph-1",
                "Margherita",
                "Tomate, mozzarella et basilic",
                13,
                10,
            ),
            new Pizza(
                "ph-2",
                "Cheese Lovers",
                "Mozzarella, cheddar et fromage fondu",
                16,
                5,
            ),
        ];

        super("pizza-hut", "Pizza Hut", menu, [17, 18, 19], {
            // // ouverture Mercredi–Lundi	11h30–15h00 / 18h00–22h30
            0: [
                { open: "11:30", close: "15:00" },
                { open: "18:00", close: "22:30" },
            ],
            1: [
                { open: "11:30", close: "15:00" },
                { open: "18:00", close: "22:30" },
            ],
            2: [],
            3: [
                { open: "11:30", close: "15:00" },
                { open: "18:00", close: "22:30" },
            ],
            4: [
                { open: "11:30", close: "15:00" },
                { open: "18:00", close: "22:30" },
            ],
            5: [
                { open: "11:30", close: "15:00" },
                { open: "18:00", close: "22:30" },
            ],
            6: [
                { open: "11:30", close: "15:00" },
                { open: "18:00", close: "22:30" },
            ],
        });
    }

    calculatePrice(pizza: Pizza): number {
        // Chaque enseigne a son menu et ses règles de prix
        return this.roundPrice(pizza.basePrice * 1.2);
    }
}