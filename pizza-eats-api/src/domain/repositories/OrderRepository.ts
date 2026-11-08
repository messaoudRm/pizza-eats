import { Order } from "../entities/Order";
import { OrderStatus } from "../entities/OrderStatus";

export interface OrderRepository {
    save(order: Order): void;

    findByCustomerEmail(email: string): Order[];

    findByStatus(
        email: string,
        status: OrderStatus,
    ): Order[];
}
