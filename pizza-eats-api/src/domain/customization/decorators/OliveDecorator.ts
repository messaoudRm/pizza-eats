import { IngredientDecorator } from "./IngredientDecorator";

export class OliveDecorator extends IngredientDecorator {
    getDescription(): string {
        return `${this.pizza.getDescription()}, Olives`;
    }

    getPrice(): number {
        return this.pizza.getPrice() + 1;
    }
}