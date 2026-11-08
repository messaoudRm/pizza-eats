import { IngredientDecorator } from "./IngredientDecorator";

export class HamDecorator extends IngredientDecorator {
    getDescription(): string {
        return `${this.pizza.getDescription()}, Jambon`;
    }

    getPrice(): number {
        return this.pizza.getPrice() + 2;
    }
}