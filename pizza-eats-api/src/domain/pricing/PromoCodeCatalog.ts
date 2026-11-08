import { PromoCodePricing } from "./strategies/PromoCodePricing";

type PromoCode = {
    discountType: "percentage" | "fixed";
    discountValue: number;
};

// us 2 : les codes promo sont définis côté serveur, le client n'envoie que le code
export class PromoCodeCatalog {
    private static readonly codes: Record<string, PromoCode> = {
        PIZZA10: { discountType: "percentage", discountValue: 10 },
        WELCOME5: { discountType: "fixed", discountValue: 5 },
    };

    static createStrategy(code?: string): PromoCodePricing {
        if (!code) {
            throw new Error("Le code promo est obligatoire");
        }

        const promoCode = this.codes[code.trim().toUpperCase()];

        if (!promoCode) {
            throw new Error(`Code promo "${code}" invalide`);
        }

        return new PromoCodePricing(
            promoCode.discountType,
            promoCode.discountValue,
        );
    }
}
