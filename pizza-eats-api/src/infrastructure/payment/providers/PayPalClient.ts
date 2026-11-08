// us 4 : service externe simulé (PayPal), avec sa propre signature : un objet de paiement
export class PayPalClient {
    sendPayment(payment: {
        total: number;
        currency: string;
        merchant: string;
    }): void {
        console.log(
            `[PayPal] Paiement de ${payment.total} ${payment.currency} via ${payment.merchant}`,
        );
    }
}
