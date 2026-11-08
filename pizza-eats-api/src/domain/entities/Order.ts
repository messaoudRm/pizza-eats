import { OrderStatus } from "./OrderStatus";

export class Order {
    constructor(
        public readonly id: string,
        private status: OrderStatus = OrderStatus.CONFIRMED,
        public readonly customerEmail: string = "",
        public readonly createdAt: Date = new Date(),
    ) {}

    getStatus(): OrderStatus {
        return this.status;
    }

    updateStatus(status: OrderStatus): void {
        this.status = status;
    }
}
