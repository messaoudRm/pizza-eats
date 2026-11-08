import { Order } from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";

export interface OrderRepository {
    save(order: Order): void;

    findById(id: string): Order | undefined;

    findByCustomerEmail(email: string): Order[];

    findByStatus(
        email: string,
        status: OrderStatus,
    ): Order[];
}
