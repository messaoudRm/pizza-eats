import { OrderObserver } from "../OrderObserver";
import { OrderStatus } from "../../entities/OrderStatus";

export class PushNotificationListener implements OrderObserver {
    update(orderId: string, status: OrderStatus): void {
        console.log(
            `[Push] Notification push envoyée : commande ${orderId}, nouveau statut : ${status}`,
        );
    }
}