
import { Order } from "../../domain/entities/Order";
import { OrderStatus } from "../../domain/entities/OrderStatus";
import { OrderSubject } from "../../domain/notifications/OrderSubject";

export class OrderNotificationService {
    async updateStatus(
        order: Order,
        status: OrderStatus,
        subject: OrderSubject,
        customerEmail: string,
    ): Promise<void> {
        if (order.getStatus() === status) {
            return;
        }

        order.updateStatus(status);

        await subject.notify(
            order.id,
            status,
            customerEmail,
        );
    }
}
