import { PricingStrategy } from "./strategies/PricingStrategy";

export class PricingContext {
    constructor(private strategy: PricingStrategy) {}

    setStrategy(strategy: PricingStrategy): void {
        this.strategy = strategy;
    }

    calculatePrice(basePrice: number): number {
        return this.strategy.calculatePrice(basePrice);
    }
}