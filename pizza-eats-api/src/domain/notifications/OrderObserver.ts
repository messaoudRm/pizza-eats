
import { OrderStatus } from "../entities/OrderStatus";

export interface OrderObserver {
    update(
        orderId: string,
        status: OrderStatus,
        customerEmail: string,
    ): Promise<void> | void;
}
