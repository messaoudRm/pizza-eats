import { PaymentMethod } from "../PaymentMethod";

export class CreditCardAdapter implements PaymentMethod {
    pay(amount: number): void {
        this.processCreditCardPayment(amount);
    }

    private processCreditCardPayment(amount: number): void {
        console.log(`[Carte bancaire] Paiement de ${amount} € par carte bancaire`);
    }
}
