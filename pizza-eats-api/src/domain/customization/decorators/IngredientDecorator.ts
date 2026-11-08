import { CustomizablePizza } from "../CustomizablePizza";

export abstract class IngredientDecorator implements CustomizablePizza {
    constructor(protected readonly pizza: CustomizablePizza) {}

    abstract getDescription(): string;

    abstract getPrice(): number;
}