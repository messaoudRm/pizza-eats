import { OrderObserver } from "../OrderObserver";
import { OrderStatus } from "../../entities/OrderStatus";

export class SMSNotificationListener implements OrderObserver {
    update(orderId: string, status: OrderStatus): void {
        console.log(
            `[SMS] Message envoyé : commande ${orderId}, nouveau statut : ${status}`,
        );
    }
}