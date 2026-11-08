import { IngredientDecorator } from "./IngredientDecorator";

export class MozzarellaDecorator extends IngredientDecorator {
    getDescription(): string {
        return `${this.pizza.getDescription()}, Mozzarella`;
    }

    getPrice(): number {
        return this.pizza.getPrice() + 1.5;
    }
}