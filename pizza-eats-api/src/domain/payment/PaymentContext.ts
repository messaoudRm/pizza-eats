import { PaymentMethod } from "./PaymentMethod";

export class PaymentContext {
    constructor(private paymentMethod: PaymentMethod) {}

    setPaymentMethod(paymentMethod: PaymentMethod): void {
        this.paymentMethod = paymentMethod;
    }

    pay(amount: number): void {
        this.paymentMethod.pay(amount);
    }
}
