import { Pizza } from "./Pizza";

export abstract class Brand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    protected readonly menu: Pizza[],
  ) {}

  getMenu(): Pizza[] {
    return this.menu;
  }

  protected roundPrice(price: number): number {
    return Math.round((price + Number.EPSILON) * 100) / 100;
  }

  abstract calculatePrice(pizza: Pizza): number;

  getPizzaById(pizzaId: string): Pizza | undefined {
      return this.menu.find((pizza) => pizza.id === pizzaId);
  }

}
