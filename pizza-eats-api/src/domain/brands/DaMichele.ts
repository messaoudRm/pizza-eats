import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class DaMichele extends Brand {
  constructor() {
    const menu = [
        new Pizza(
            "dm-1",
            "Margherita",
            "Tomate, mozzarella et basilic",
            10,
            10,
        ),
        new Pizza(
            "dm-2",
            "Marinara",
            "Tomate, ail et origan",
            8,
            8,
        ),
    ];

      super("da-michele", "Da Michele", menu, [10, 11, 12], {
          // ouverture Mardi–Dimanche	11h30–14h30 / 18h30–22h30
          0: [],
          1: [],
          2: [
              { open: "11:30", close: "14:30" },
              { open: "18:30", close: "22:30" },
          ],
          3: [
              { open: "11:30", close: "14:30" },
              { open: "18:30", close: "22:30" },
          ],
          4: [
              { open: "11:30", close: "14:30" },
              { open: "18:30", close: "22:30" },
          ],
          5: [
              { open: "11:30", close: "14:30" },
              { open: "18:30", close: "22:30" },
          ],
          6: [
              { open: "11:30", close: "14:30" },
              { open: "18:30", close: "22:30" },
          ],
      });
  }

  calculatePrice(pizza: Pizza): number {
    return this.roundPrice(pizza.basePrice);
  }
}
