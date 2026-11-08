import { IngredientDecorator } from "./IngredientDecorator";

export class PepperoniDecorator extends IngredientDecorator {
    getDescription(): string {
        return `${this.pizza.getDescription()}, Pepperoni`;
    }

    getPrice(): number {
        return this.pizza.getPrice() + 2;
    }
}