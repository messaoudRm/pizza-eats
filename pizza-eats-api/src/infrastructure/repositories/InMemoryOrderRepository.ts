import { Order } from "../../domain/entities/Order";
import { OrderStatus } from "../../domain/entities/OrderStatus";
import { OrderRepository } from "../../domain/repositories/OrderRepository";

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Order[] = [];

    save(order: Order): void {
        const existingIndex = this.orders.findIndex(
            (existingOrder) => existingOrder.id === order.id,
        );

        if (existingIndex !== -1) {
            this.orders[existingIndex] = order;
        } else {
            this.orders.push(order);
        }
    }

    findById(id: string): Order | undefined {
        return this.orders.find((order) => order.id === id);
    }

    findByCustomerEmail(email: string): Order[] {
        return this.orders.filter(
            (order) => order.customerEmail === email,
        );
    }

    findByStatus(email: string, status: OrderStatus): Order[] {
        return this.orders.filter(
            (order) =>
                order.customerEmail === email &&
                order.getStatus() === status,
        );
    }
}
