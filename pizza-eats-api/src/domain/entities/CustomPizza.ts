import { CustomizablePizza } from "../customization/CustomizablePizza";

export type PizzaBase = "tomato" | "cream";
export type PizzaSize = "S" | "M" | "L" | "XL";

export type Ingredient =
    | "mozzarella"
    | "pepperoni"
    | "mushrooms"
    | "ham"
    | "olives"
    | "gorgonzola";

export class CustomPizza implements CustomizablePizza {
    constructor(
        public readonly base: PizzaBase,
        public readonly size: PizzaSize,
        public readonly ingredients: Ingredient[],
    ) {}

    getDescription(): string {
        return `Pizza base ${this.base}, taille ${this.size}`;
    }

    getPrice(): number {
        // prix de base
        return 5;
    }
}