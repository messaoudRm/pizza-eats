import { IngredientDecorator } from "./IngredientDecorator";

export class GorgonzolaDecorator extends IngredientDecorator {
    getDescription(): string {
        return `${this.pizza.getDescription()}, Gorgonzola`;
    }

    getPrice(): number {
        return this.pizza.getPrice() + 2.5;
    }
}