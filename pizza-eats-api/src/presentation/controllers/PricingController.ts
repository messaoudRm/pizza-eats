import { PricingService } from "../../application/services/PricingService";
import { BrandFactory } from "../../domain/factories/BrandFactory";
import { PricingStrategyRegistry } from "../../domain/pricing/PricingStrategyRegistry";
import { CustomPizzaId } from "../../domain/customization/CustomPizzaId";
import { CustomPizzaService } from "../../application/services/CustomPizzaService";

export type PricingRequest = {
    brandId: string;
    pizzas: {
        pizzaId: string;
        quantity: number;
        size?: "S" | "M" | "L" | "XL";
    }[];
    strategy: string;
    promoCode?: string;
};

export class PricingController {
    private readonly customPizzaService = new CustomPizzaService();

    constructor(private readonly pricingService: PricingService) {}

    calculatePrice(request: PricingRequest) {
        const brand = BrandFactory.create(request.brandId);

        const pizzas = request.pizzas.map((item) => {
            const pizza = brand.getPizzaById(item.pizzaId);
            let name: string;
            let unitPrice: number;

            if (pizza) {
                name = pizza.name;
                // Sans taille, le prix du menu (taille M) s'applique
                unitPrice = item.size
                    ? brand.calculatePriceForSize(pizza, item.size)
                    : brand.calculatePrice(pizza);
            } else {
                // Pizza composée : le prix est calculé selon sa composition et l'enseigne
                const custom = CustomPizzaId.decode(item.pizzaId);

                if (!custom) {
                    throw new Error(`Pizza "${item.pizzaId}" not found`);
                }

                name = "Pizza composée";
                unitPrice = this.customPizzaService.customize({
                    brandId: request.brandId,
                    ...custom,
                }).total;
            }

            const totalPrice = Math.round(unitPrice * item.quantity * 100) / 100;

            return {
                id: item.pizzaId,
                name,
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