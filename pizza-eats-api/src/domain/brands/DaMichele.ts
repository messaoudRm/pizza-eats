import { Brand } from "../entities/Brand";
import { Pizza } from "../entities/Pizza";

export class DaMichele extends Brand {
  constructor() {
    const menu = [
      new Pizza("dm-1", "Margherita", "Tomate, mozzarella et basilic", 10),
      new Pizza("dm-2", "Marinara", "Tomate, ail et origan", 8),
    ];

    super("da-michele", "Da Michele", menu);
  }

  calculatePrice(pizza: Pizza): number {
    return this.roundPrice(pizza.basePrice);
  }
}
