import { PricingService } from "../../application/services/PricingService";
import { BrandFactory } from "../../domain/factories/BrandFactory";
import { PricingStrategy } from "../../domain/pricing/strategies/PricingStrategy";
import { StandardPricing } from "../../domain/pricing/strategies/StandardPricing";
import { HappyHourPricing } from "../../domain/pricing/strategies/HappyHourPricing";
import { LoyaltyPricing } from "../../domain/pricing/strategies/LoyaltyPricing";
import { PromoCodePricing } from "../../domain/pricing/strategies/PromoCodePricing";

type PricingRequest = {
    brandId: string;
    pizzas: {
        pizzaId: string;
        quantity: number;
    }[];
    strategy: "standard" | "happy-hour" | "loyalty" | "promo-code";
    discountType?: "percentage" | "fixed";
    discountValue?: number;
};

export class PricingController {
    constructor(private readonly pricingService: PricingService) {}

    calculatePrice(request: PricingRequest) {
        const brand = BrandFactory.create(request.brandId);

        const pizzas = request.pizzas.map((item) => {
            const pizza = brand.getPizzaById(item.pizzaId);

            if (!pizza) {
                throw new Error(`Pizza "${item.pizzaId}" not found`);
            }

            const unitPrice = brand.calculatePrice(pizza);
            const totalPrice = Math.round(unitPrice * item.quantity * 100) / 100;

            return {
                id: pizza.id,
                name: pizza.name,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
            };
        });

        const total = Math.round(
            pizzas.reduce((sum, pizza) => sum + pizza.totalPrice, 0) * 100,
        ) / 100;

        let strategy: PricingStrategy;

        switch (request.strategy) {
            case "standard":
                strategy = new StandardPricing();
                break;
            case "happy-hour":
                strategy = new HappyHourPricing();
                break;
            case "loyalty":
                strategy = new LoyaltyPricing();
                break;
            case "promo-code":
                if (
                    request.discountType === undefined ||
                    request.discountValue === undefined
                ) {
                    throw new Error("Promo code discount details are required");
                }

                strategy = new PromoCodePricing(
                    request.discountType,
                    request.discountValue,
                );
                break;
        }

        const { discount, finalPrice } =
            this.pricingService.calculatePrice(total, strategy);

        return {
            brand: {
                id: brand.id,
                name: brand.name,
            },
            pizzas,
            total,
            promotion:
                request.strategy === "standard"
                    ? null
                    : {
                        strategy: request.strategy,
                        discount,
                    },
            finalPrice,
        };
    }
}