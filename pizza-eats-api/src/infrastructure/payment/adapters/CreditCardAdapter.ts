import { PaymentMethod } from "../../../domain/payment/PaymentMethod";
import { CardPaymentGateway } from "../providers/CardPaymentGateway";

// us 4 : Adapter, traduit pay(amount) vers l'API de CardPaymentGateway (euros -> centimes)
export class CreditCardAdapter implements PaymentMethod {
    constructor(private readonly gateway: CardPaymentGateway = new CardPaymentGateway()) {}

    pay(amount: number): void {
        const amountInCents = Math.round(amount * 100);

        this.gateway.charge(amountInCents, "EUR");
    }
}
