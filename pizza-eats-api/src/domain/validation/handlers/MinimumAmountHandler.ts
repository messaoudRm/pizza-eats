import {
    OrderValidationHandler,
    OrderValidationData,
} from "../OrderValidationHandler";

export class MinimumAmountHandler extends OrderValidationHandler {
    protected validate(order: OrderValidationData): string | null {
        if (order.total < 15) {
            return "Le montant minimum de la commande est de 15 €";
        }

        return null;
    }
}