import { PaymentMethod } from "../PaymentMethod";

export class CashOnDeliveryAdapter implements PaymentMethod {
    pay(amount: number): void {
        this.registerCashPayment("EUR", amount);
    }

    private registerCashPayment(currency: string, amount: number): void {
        console.log(
            `[Espèces à la réception] Paiement de ${amount} ${currency} à la livraison`,
        );
    }
}
