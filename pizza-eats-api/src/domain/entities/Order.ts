import { OrderStatus } from "./OrderStatus";

export class Order {
    constructor(
        public readonly id: string,
        private status: OrderStatus = OrderStatus.CONFIRMED,
        public readonly customerEmail: string = "",
    ) {}

    getStatus(): OrderStatus {
        return this.status;
    }

    updateStatus(status: OrderStatus): void {
        this.status = status;
    }
}
