import {
    OrderValidationHandler,
    OrderValidationData,
} from "../OrderValidationHandler";
import { BrandFactory } from "../../factories/BrandFactory";

export class StockAvailabilityHandler extends OrderValidationHandler {
    protected validate(order: OrderValidationData): string | null {
        const brand = BrandFactory.create(order.brandId);

        const requestedQuantities = new Map<string, number>();

        for (const item of order.pizzas) {
            const currentQuantity =
                requestedQuantities.get(item.pizzaId) ?? 0;

            requestedQuantities.set(
                item.pizzaId,
                currentQuantity + item.quantity,
            );
        }

        for (const [pizzaId, quantity] of requestedQuantities) {
            const pizza = brand.getPizzaById(pizzaId);

            if (!pizza) {
                return `Pizza "${pizzaId}" introuvable`;
            }

            if (quantity > pizza.stock) {
                return `Stock insuffisant pour ${pizza.name}. Stock disponible : ${pizza.stock}`;
            }
        }

        return null;
    }
}