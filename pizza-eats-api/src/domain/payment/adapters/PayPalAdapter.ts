import { PaymentMethod } from "../PaymentMethod";

export class PayPalAdapter implements PaymentMethod {
    pay(amount: number): void {
        this.executePayPalPayment({
            amount,
            currency: "EUR",
            source: "Pizza Eats",
        });
    }

    private executePayPalPayment(payment: {
        amount: number;
        currency: string;
        source: string;
    }): void {
        console.log(
            `[PayPal] Paiement de ${payment.amount} ${payment.currency} via ${payment.source}`,
        );
    }
}
