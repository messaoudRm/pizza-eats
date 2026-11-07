
import { OrderObserver } from "./OrderObserver";
import { OrderStatus } from "../entities/OrderStatus";

export class OrderSubject {
    private observers: OrderObserver[] = [];

    subscribe(observer: OrderObserver): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    unsubscribe(observer: OrderObserver): void {
        this.observers = this.observers.filter(
            (item) => item !== observer
        );
    }

    async notify(
        orderId: string,
        status: OrderStatus,
        customerEmail: string,
    ): Promise<void> {
        await Promise.all(
            this.observers.map((observer) =>
                observer.update(orderId, status, customerEmail)
            )
        );
    }
}
