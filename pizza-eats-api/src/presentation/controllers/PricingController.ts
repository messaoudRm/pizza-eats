import { PricingService } from "../../application/services/PricingService";
import { BrandFactory } from "../../domain/factories/BrandFactory";
import { PricingStrategyRegistry } from "../../domain/pricing/PricingStrategyRegistry";

export type PricingRequest = {
    brandId: string;
    pizzas: {
        pizzaId: string;
        quantity: number;
    }[];
    strategy: string;
    promoCode?: string;
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

        // us 2 : la stratégie est choisie dynamiquement via le registry, sans switch
        const strategy = PricingStrategyRegistry.create(request.strategy, {
            promoCode: request.promoCode,
        });

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