import {
    OrderValidationHandler,
    OrderValidationData,
} from "../OrderValidationHandler";
import { BrandFactory } from "../../factories/BrandFactory";
import { CustomPizzaId } from "../../customization/CustomPizzaId";
import { StockRepository } from "../../repositories/StockRepository";

export class StockAvailabilityHandler extends OrderValidationHandler {
    // Sans repository, le stock initial du menu est utilisé
    constructor(private readonly stockRepository?: StockRepository) {
        super();
    }

    protected validate(order: OrderValidationData): string | null {
        const brand = BrandFactory.create(order.brandId);

        const requestedQuantities = new Map<string, number>();

        for (const item of order.pizzas) {
            const currentQuantity =
                requestedQuantities.get(item.pizzaId) ?? 0;

            requestedQuantities.set(
                item.pizzaId,
                currentQuantity + item.quantity,
            );
        }

        for (const [pizzaId, quantity] of requestedQuantities) {
            const pizza = brand.getPizzaById(pizzaId);

            // Une pizza composée est préparée à la demande : pas de stock à vérifier
            if (!pizza && CustomPizzaId.decode(pizzaId)) {
                continue;
            }

            if (!pizza) {
                return `Pizza "${pizzaId}" introuvable`;
            }

            const stock = this.stockRepository
                ? this.stockRepository.getStock(order.brandId, pizzaId)
                : pizza.stock;

            if (quantity > stock) {
                return `Stock insuffisant pour ${pizza.name}. Stock disponible : ${stock}`;
            }
        }

        return null;
    }
}