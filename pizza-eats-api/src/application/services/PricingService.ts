import { PricingContext } from "../../domain/pricing/PricingContext";
import { PricingStrategy } from "../../domain/pricing/strategies/PricingStrategy";

export class PricingService {
    calculatePrice(
        total: number,
        strategy: PricingStrategy,
    ): {
        discount: number;
        finalPrice: number;
    } {
        const pricingContext = new PricingContext(strategy);

        const calculatedPrice = pricingContext.calculatePrice(total);

        const finalPrice = Math.min(
            total,
            Math.max(0, calculatedPrice),
        );

        return {
            discount: Math.round((total - finalPrice) * 100) / 100,
            finalPrice,
        };
    }
}