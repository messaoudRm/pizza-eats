// us 4 : service externe simulé (carte bancaire), avec sa propre signature : montant en centimes
export class CardPaymentGateway {
    charge(amountInCents: number, currency: string): void {
        console.log(
            `[Carte bancaire] Débit de ${amountInCents} centimes (${currency})`,
        );
    }
}
