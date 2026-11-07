export interface PricingStrategy {
    calculatePrice(basePrice: number): number;
}