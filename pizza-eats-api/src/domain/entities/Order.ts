import { OrderStatus } from "./OrderStatus";

// Une ligne de commande : permet de remettre les pizzas en stock si la commande est annulée
export type OrderLine = {
    pizzaId: string;
    quantity: number;
};

export class Order {
    constructor(
        public readonly id: string,
        private status: OrderStatus = OrderStatus.CONFIRMED,
        public readonly customerEmail: string = "",
        public readonly createdAt: Date = new Date(),
        public readonly brandId: string = "",
        public readonly lines: OrderLine[] = [],
    ) {}

    getStatus(): OrderStatus {
        return this.status;
    }

    updateStatus(status: OrderStatus): void {
        this.status = status;
    }
}
