
import { PaymentContext } from "../../domain/payment/PaymentContext";
import { PaymentMethod } from "../../domain/payment/PaymentMethod";
import { CreditCardAdapter } from "../../infrastructure/payment/adapters/CreditCardAdapter";
import { CashOnDeliveryAdapter } from "../../infrastructure/payment/adapters/CashOnDeliveryAdapter";
import { PayPalAdapter } from "../../infrastructure/payment/adapters/PayPalAdapter";

export class PaymentService {
  private readonly paymentMethods: Record<string, PaymentMethod> = {
    "credit-card": new CreditCardAdapter(),
    "cash-on-delivery": new CashOnDeliveryAdapter(),
    paypal: new PayPalAdapter(),
  };

  pay(
    method: string,
    amount: number,
  ): { success: boolean; message: string } {
    const paymentMethod = this.paymentMethods[method];

    if (!paymentMethod) {
      throw new Error(`Moyen de paiement "${method}" non reconnu`);
    }

    const paymentContext = new PaymentContext(paymentMethod);

    // Si l'utilisateur choisit les espèces directement
    if (method === "cash-on-delivery") {
      paymentContext.pay(amount);

      return {
        success: true,
        message: "Paiement simulé avec succès",
      };
    }

    const randomNumber = Math.floor(Math.random() * 10) + 1;

    console.log(`[PaymentService] Nombre tiré : ${randomNumber}`);

    // Nombre pair : paiement réussi avec le moyen choisi
    if (randomNumber % 2 === 0) {
      paymentContext.pay(amount);

      return {
        success: true,
        message: `Paiement avec succès via ${method}`,
      };
    }

    // Nombre impair : basculement automatique vers les espèces
    console.log(
      "[PaymentService] Échec du paiement. Basculement vers les espèces.",
    );

    paymentContext.setPaymentMethod(new CashOnDeliveryAdapter());
    paymentContext.pay(amount);

    return {
      success: false,
      message: "Le paiement a échoué. Basculement automatique vers le paiement en espèces.",
    };
  }
}
