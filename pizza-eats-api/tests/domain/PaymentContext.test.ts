import { describe, it, expect, vi, afterEach } from "vitest";
import { PaymentContext } from "../../src/domain/payment/PaymentContext";
import { CreditCardAdapter } from "../../src/domain/payment/adapters/CreditCardAdapter";
import { CashOnDeliveryAdapter } from "../../src/domain/payment/adapters/CashOnDeliveryAdapter";
import { PayPalAdapter } from "../../src/domain/payment/adapters/PayPalAdapter";
import { PaymentService } from "../../src/application/services/PaymentService";

describe("PaymentContext", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should process a credit card payment", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const context = new PaymentContext(new CreditCardAdapter());

    context.pay(25);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[Carte bancaire] Paiement de 25 € par carte bancaire",
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
      "[Carte bancaire] Paiement de 25 € par carte bancaire",
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
      "[Carte bancaire] Paiement de 25 € par carte bancaire",
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
      "[Carte bancaire] Paiement de 25 € par carte bancaire",
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
});
