import {
    OrderValidationHandler,
    OrderValidationData,
} from "../OrderValidationHandler";

export class NonEmptyCartHandler extends OrderValidationHandler {
    protected validate(order: OrderValidationData): string | null {
        if (order.pizzas.length === 0) {
            return "Le panier est vide";
        }

        return null;
    }
}