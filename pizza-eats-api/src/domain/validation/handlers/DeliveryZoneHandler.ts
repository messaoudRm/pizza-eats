import {
    OrderValidationHandler,
    OrderValidationData,
} from "../OrderValidationHandler";

import { BrandFactory } from "../../factories/BrandFactory";

export class DeliveryZoneHandler extends OrderValidationHandler {
    protected validate(order: OrderValidationData): string | null {
        const brand = BrandFactory.create(order.brandId);

        if (!brand.deliveryArrondissements.includes(order.deliveryArrondissement)) {
            return "L'adresse de livraison est en dehors de la zone desservie par cette enseigne";
        }

        return null;
    }
}