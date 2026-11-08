import { OrderHistoryService } from "../../application/services/OrderHistoryService";
import { OrderStatus } from "../../domain/entities/OrderStatus";

export class OrderHistoryController {
    constructor(
        private readonly orderHistoryService: OrderHistoryService,
    ) {}

    getOrderHistory(
        customerEmail: string,
        status?: OrderStatus,
    ) {
        return this.orderHistoryService.getOrderHistory(
            customerEmail,
            status,
        );
    }
}
