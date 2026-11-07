export type OrderValidationData = {
    brandId: string;
    deliveryArrondissement: number;
    total: number;
    currentDateTime?: string;
    pizzas: {
        pizzaId: string;
        quantity: number;
    }[];
};

export abstract class OrderValidationHandler {
    private nextHandler?: OrderValidationHandler;

    setNext(handler: OrderValidationHandler): OrderValidationHandler {
        this.nextHandler = handler;
        return handler;
    }

    handle(order: OrderValidationData): string | null {
        const error = this.validate(order);

        if (error) {
            return error;
        }

        return this.nextHandler?.handle(order) ?? null;
    }

    protected abstract validate(order: OrderValidationData): string | null;
}