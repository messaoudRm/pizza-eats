import { BrandRegistry } from "../../domain/registries/BrandRegistry";
import { PizzaBuilder } from "../../domain/customization/PizzaBuilder";
import {
    PizzaBase,
    PizzaSize,
    Ingredient,
} from "../../domain/entities/CustomPizza";

export type CustomPizzaRequest = {
    brandId: string;
    base: PizzaBase;
    size: PizzaSize;
    ingredients: Ingredient[];
};

export class CustomPizzaService {
    customize(request: CustomPizzaRequest) {
        const BrandClass = BrandRegistry.get(request.brandId);
        const brand = new BrandClass();

        const builder = new PizzaBuilder()
            .setBase(request.base)
            .setSize(request.size);

        for (const ingredient of request.ingredients) {
            builder.addIngredient(ingredient);
        }

        const pizza = builder.build();
        const price = pizza.getPrice();

        return {
            brand: brand.name,
            base: request.base,
            size: request.size,
            ingredients: request.ingredients,
            description: pizza.getDescription(),
            total: Math.round(
                (price * brand.getSizeMultiplier(request.size) + Number.EPSILON) * 100
            ) / 100,
        };
    }
}
