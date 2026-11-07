import { PricingStrategy } from "./PricingStrategy";

export class HappyHourPricing implements PricingStrategy {
    calculatePrice(basePrice: number): number {
        return Math.round(basePrice * 0.8 * 100) / 100;
    }
}