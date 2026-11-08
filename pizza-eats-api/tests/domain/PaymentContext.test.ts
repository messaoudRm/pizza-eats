import { describe, it, expect, vi, afterEach } from "vitest";
import { PaymentContext } from "../../src/domain/payment/PaymentContext";
import { CreditCardAdapter } from "../../src/infrastructure/payment/adapters/CreditCardAdapter";
import { CashOnDeliveryAdapter } from "../../src/infrastructure/payment/adapters/CashOnDeliveryAdapter";
import { PayPalAdapter } from "../../src/infrastructure/payment/adapters/PayPalAdapter";
import { PaymentService } from "../../src/application/services/PaymentService";
import { CardPaymentGateway } from "../../src/infrastructure/payment/providers/CardPaymentGateway";
import { PayPalClient } from "../../src/infrastructure/payment/providers/PayPalClient";
import { CashRegister } from "../../src/infrastructure/payment/providers/CashRegister";

describe("PaymentContext", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should process a credit card payment", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const context = new PaymentContext(new CreditCardAdapter());

    context.pay(25);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Carte bancaire] Débit de 2500 centimes (EUR)",
    );
  });

  it("should process a cash on delivery payment", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const context = new PaymentContext(new CashOnDeliveryAdapter());

    context.pay(25);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Espèces à la réception] Paiement de 25 EUR à la livraison",
    );
  });

  it("should process a PayPal payment", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const context = new PaymentContext(new PayPalAdapter());

    context.pay(25);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[PayPal] Paiement de 25 EUR via Pizza Eats",
    );
  });

  it("should switch payment method dynamically", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const context = new PaymentContext(new CreditCardAdapter());

    context.pay(25);

    context.setPaymentMethod(new PayPalAdapter());
    context.pay(30);

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "[Carte bancaire] Débit de 2500 centimes (EUR)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      2,
      "[PayPal] Paiement de 30 EUR via Pizza Eats",
    );
  });

  it("should switch payment method after a platform incident when requested", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const context = new PaymentContext(new CreditCardAdapter());

    context.pay(25);

    const platformIncident = true;

    if (platformIncident) {
      context.setPaymentMethod(new PayPalAdapter());
    }

    context.pay(30);

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "[Carte bancaire] Débit de 2500 centimes (EUR)",
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(
      2,
      "[PayPal] Paiement de 30 EUR via Pizza Eats",
    );
  });

  it("should keep the selected payment method when the random number is even", () => {
    // 0.1 donne 2 (pair)
    vi.spyOn(Math, "random").mockReturnValue(0.1);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const service = new PaymentService();

    service.pay("credit-card", 25);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[PaymentService] Nombre tiré : 2",
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Carte bancaire] Débit de 2500 centimes (EUR)",
    );
  });

  it("should switch to cash when the random number is odd", () => {
    // 0.2 donne 3 (impair)
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const service = new PaymentService();

    service.pay("credit-card", 25);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[PaymentService] Nombre tiré : 3",
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Espèces à la réception] Paiement de 25 EUR à la livraison",
    );
  });

  it("should not simulate failure when cash is selected", () => {
    const randomSpy = vi.spyOn(Math, "random");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const service = new PaymentService();

    service.pay("cash-on-delivery", 25);

    expect(randomSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[Espèces à la réception] Paiement de 25 EUR à la livraison",
    );
  });

  // us 4 : chaque adapter traduit pay(amount) vers la signature propre à son service externe
  describe("Adapters", () => {
    it("CreditCardAdapter should call CardPaymentGateway.charge in cents", () => {
      const gateway = new CardPaymentGateway();
      const chargeSpy = vi.spyOn(gateway, "charge").mockImplementation(() => {});

      new CreditCardAdapter(gateway).pay(25.5);

      expect(chargeSpy).toHaveBeenCalledWith(2550, "EUR");
    });

    it("PayPalAdapter should call PayPalClient.sendPayment with a payment object", () => {
      const client = new PayPalClient();
      const sendSpy = vi.spyOn(client, "sendPayment").mockImplementation(() => {});

      new PayPalAdapter(client).pay(25);

      expect(sendSpy).toHaveBeenCalledWith({
        total: 25,
        currency: "EUR",
        merchant: "Pizza Eats",
      });
    });

    it("CashOnDeliveryAdapter should call CashRegister.registerCashOnDelivery", () => {
      const register = new CashRegister();
      const registerSpy = vi
        .spyOn(register, "registerCashOnDelivery")
        .mockImplementation(() => {});

      new CashOnDeliveryAdapter(register).pay(25);

      expect(registerSpy).toHaveBeenCalledWith("EUR", 25);
    });
  });
});
