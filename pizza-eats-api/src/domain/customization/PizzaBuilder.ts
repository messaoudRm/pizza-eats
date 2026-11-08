
import {
    CustomPizza,
    PizzaBase,
    PizzaSize,
    Ingredient,
} from "../entities/CustomPizza";
import { CustomizablePizza } from "./CustomizablePizza";

import { MozzarellaDecorator } from "./decorators/MozzarellaDecorator";
import { PepperoniDecorator } from "./decorators/PepperoniDecorator";
import { MushroomDecorator } from "./decorators/MushroomDecorator";
import { HamDecorator } from "./decorators/HamDecorator";
import { OliveDecorator } from "./decorators/OliveDecorator";
import { GorgonzolaDecorator } from "./decorators/GorgonzolaDecorator";

export class PizzaBuilder {
    private base: PizzaBase = "tomato";
    private size: PizzaSize = "M";
    private ingredients: Ingredient[] = [];

    setBase(base: PizzaBase): this {
        this.base = base;
        return this;
    }

    setSize(size: PizzaSize): this {
        this.size = size;
        return this;
    }

    addIngredient(ingredient: Ingredient): this {
        this.ingredients.push(ingredient);
        return this;
    }

    build(): CustomizablePizza {
        let pizza: CustomizablePizza = new CustomPizza(
            this.base,
            this.size,
            [...this.ingredients],
        );

        for (const ingredient of this.ingredients) {
            switch (ingredient) {
                case "mozzarella":
                    pizza = new MozzarellaDecorator(pizza);
                    break;
                case "pepperoni":
                    pizza = new PepperoniDecorator(pizza);
                    break;
                case "mushrooms":
                    pizza = new MushroomDecorator(pizza);
                    break;
                case "ham":
                    pizza = new HamDecorator(pizza);
                    break;
                case "olives":
                    pizza = new OliveDecorator(pizza);
                    break;
                case "gorgonzola":
                    pizza = new GorgonzolaDecorator(pizza);
                    break;
            }
        }

        return pizza;
    }
}
