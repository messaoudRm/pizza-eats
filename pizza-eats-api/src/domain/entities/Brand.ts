import { Pizza } from "./Pizza";

export type OpeningInterval = {
    open: string;
    close: string;
};

export type OpeningHours = {
    [day: number]: OpeningInterval[];
};

export type SizeMultipliers = {
    S: number;
    M: number;
    L: number;
    XL: number;
};


export abstract class Brand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    protected readonly menu: Pizza[],
    public readonly deliveryArrondissements: number[],
    public readonly openingHours: OpeningHours,
    // us 8 : multiplicateur de taille propre à chaque enseigne
    protected readonly sizeMultipliers: SizeMultipliers,
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

    getSizeMultiplier(size: "S" | "M" | "L" | "XL"): number {
        return this.sizeMultipliers[size];
    }

}
