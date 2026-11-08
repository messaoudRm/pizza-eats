import { PaymentMethod } from "../../../domain/payment/PaymentMethod";
import { CashRegister } from "../providers/CashRegister";

// us 4 : Adapter, traduit pay(amount) vers l'API de CashRegister (devise en premier)
export class CashOnDeliveryAdapter implements PaymentMethod {
    constructor(private readonly register: CashRegister = new CashRegister()) {}

    pay(amount: number): void {
        this.register.registerCashOnDelivery("EUR", amount);
    }
}
