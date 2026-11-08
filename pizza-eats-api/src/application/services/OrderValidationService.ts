import { OrderValidationHandler } from "../../domain/validation/OrderValidationHandler";
import { NonEmptyCartHandler } from "../../domain/validation/handlers/NonEmptyCartHandler";
import { MinimumAmountHandler } from "../../domain/validation/handlers/MinimumAmountHandler";
import { DeliveryZoneHandler } from "../../domain/validation/handlers/DeliveryZoneHandler";
import { BrandOpeningHandler } from "../../domain/validation/handlers/BrandOpeningHandler";
import { StockAvailabilityHandler } from "../../domain/validation/handlers/StockAvailabilityHandler";
import { StockRepository } from "../../domain/repositories/StockRepository";

export class OrderValidationService {
    constructor(private readonly stockRepository?: StockRepository) {}

    // us 3 Je connais un pattern qu’on a vu en fin de cours pour ça
    validate(order: Parameters<OrderValidationHandler["handle"]>[0]): string | null {
        const nonEmptyCart = new NonEmptyCartHandler();
        const minimumAmount = new MinimumAmountHandler();
        const deliveryZone = new DeliveryZoneHandler();
        const brandOpening = new BrandOpeningHandler();
        const stockAvailability = new StockAvailabilityHandler(this.stockRepository);

        nonEmptyCart
            .setNext(minimumAmount)
            .setNext(deliveryZone)
            .setNext(brandOpening)
            .setNext(stockAvailability);

        return nonEmptyCart.handle(order);
    }
}