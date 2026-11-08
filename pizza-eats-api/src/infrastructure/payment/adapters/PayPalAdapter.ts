import { PaymentMethod } from "../../../domain/payment/PaymentMethod";
import { PayPalClient } from "../providers/PayPalClient";

// us 4 : Adapter, traduit pay(amount) vers l'API de PayPalClient (objet de paiement)
export class PayPalAdapter implements PaymentMethod {
    constructor(private readonly client: PayPalClient = new PayPalClient()) {}

    pay(amount: number): void {
        this.client.sendPayment({
            total: amount,
            currency: "EUR",
            merchant: "Pizza Eats",
        });
    }
}
