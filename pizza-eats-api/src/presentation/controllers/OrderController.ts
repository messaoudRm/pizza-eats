import { OrderValidationService } from "../../application/services/OrderValidationService";
import { OrderValidationData } from "../../domain/validation/OrderValidationHandler";

export class OrderController {
    constructor(
        private readonly orderValidationService: OrderValidationService,
    ) {}

    validateOrder(order: OrderValidationData) {
        const error = this.orderValidationService.validate(order);

        if (error) {
            return {
                valid: false,
                message: error,
            };
        }

        return {
            valid: true,
            message: "La commande est valide",
        };
    }
}