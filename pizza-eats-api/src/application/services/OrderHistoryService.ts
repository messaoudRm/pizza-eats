
import { Order } from "../../domain/entities/Order";
import { OrderStatus } from "../../domain/entities/OrderStatus";
import { OrderRepository } from "../../domain/repositories/OrderRepository";

export class OrderHistoryService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) {}

    getOrderHistory(
        customerEmail: string,
        status?: OrderStatus,
    ): Order[] {
        const orders = status
            ? this.orderRepository.findByStatus(customerEmail, status)
            : this.orderRepository.findByCustomerEmail(customerEmail);

        return orders.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
    }
}
