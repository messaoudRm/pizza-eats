import { IngredientDecorator } from "./IngredientDecorator";

export class MushroomDecorator extends IngredientDecorator {
    getDescription(): string {
        return `${this.pizza.getDescription()}, Champignons`;
    }

    getPrice(): number {
        return this.pizza.getPrice() + 1;
    }
}