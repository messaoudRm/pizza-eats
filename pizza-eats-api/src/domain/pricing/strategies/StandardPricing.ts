import { PricingStrategy } from "./PricingStrategy";

export class StandardPricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return basePrice;
    }
}