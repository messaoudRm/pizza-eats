import { OrderStatus } from "../../domain/entities/OrderStatus";
import { OrderSubject } from "../../domain/notifications/OrderSubject";
import { OrderNotificationService } from "../../application/services/OrderNotificationService";
import { EmailNotificationListener } from "../../domain/notifications/listeners/EmailNotificationListener";
import { SMSNotificationListener } from "../../domain/notifications/listeners/SMSNotificationListener";
import { PushNotificationListener } from "../../domain/notifications/listeners/PushNotificationListener";
import { Order } from "../../domain/entities/Order";
import { OrderRepository } from "../../domain/repositories/OrderRepository";

export class OrderNotificationController {
    private readonly subject = new OrderSubject();
    private readonly service = new OrderNotificationService();

    private readonly listeners = {
        email: new EmailNotificationListener(),
        sms: new SMSNotificationListener(),
        push: new PushNotificationListener(),
    };

    // us 9 : le statut est mis à jour dans le repository partagé, lu par l'historique
    constructor(private readonly orderRepository: OrderRepository) {
        this.subject.subscribe(this.listeners.email);
        this.subject.subscribe(this.listeners.sms);
        this.subject.subscribe(this.listeners.push);
    }


async updateStatus(
    orderId: string,
    status: OrderStatus,
    customerEmail: string,
): Promise<{
    success: boolean;
    message: string;
    orderId: string;
    status: OrderStatus;
}> {
    let order = this.orderRepository.findById(orderId);

    if (!order) {
        order = new Order(orderId, OrderStatus.CONFIRMED, customerEmail);
        this.orderRepository.save(order);

        await this.subject.notify(
            orderId,
            OrderStatus.CONFIRMED,
            customerEmail,
        );
    }

    if (status !== OrderStatus.CONFIRMED) {
        await this.service.updateStatus(
            order,
            status,
            this.subject,
            customerEmail,
        );

        this.orderRepository.save(order);
    }

    return {
        success: true,
        message: `Statut de la commande ${orderId} mis à jour`,
        orderId,
        status: order.getStatus(),
    };
}


    toggleListener(
        name: "email" | "sms" | "push",
        enabled: boolean,
    ): void {
        const listener = this.listeners[name];

        if (enabled) {
            this.subject.subscribe(listener);
        } else {
            this.subject.unsubscribe(listener);
        }
    }
}
