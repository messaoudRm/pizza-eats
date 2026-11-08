// us 4 : service externe simulé (espèces), avec sa propre signature
export class CashRegister {
    registerCashOnDelivery(currency: string, orderAmount: number): void {
        console.log(
            `[Espèces à la réception] Paiement de ${orderAmount} ${currency} à la livraison`,
        );
    }
}
