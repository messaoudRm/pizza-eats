import { PricingStrategy } from "./PricingStrategy";

export class LoyaltyPricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return Math.round(basePrice * 0.9 * 100) / 100;
    }
}