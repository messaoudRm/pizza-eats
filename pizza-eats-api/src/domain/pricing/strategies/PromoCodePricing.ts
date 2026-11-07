import { PricingStrategy } from "./PricingStrategy";

export class PromoCodePricing implements PricingStrategy {
    constructor(
        private readonly discountType: "percentage" | "fixed",
        private readonly discountValue: number,
    ) {}

    calculatePrice(basePrice: number): number {
        const discount =
            this.discountType === "percentage"
                ? basePrice * (this.discountValue / 100)
                : this.discountValue;

        const finalPrice = basePrice - discount;

        return Math.round(Math.max(0, finalPrice) * 100) / 100;
    }
}