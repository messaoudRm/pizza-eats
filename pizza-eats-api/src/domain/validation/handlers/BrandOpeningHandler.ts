import {
    OrderValidationHandler,
    OrderValidationData,
} from "../OrderValidationHandler";
import { BrandFactory } from "../../factories/BrandFactory";

export class BrandOpeningHandler extends OrderValidationHandler {
    protected validate(order: OrderValidationData): string | null {
        const brand = BrandFactory.create(order.brandId);

        const now = order.currentDateTime
            ? new Date(order.currentDateTime)
            : new Date();

        if (Number.isNaN(now.getTime())) {
            return "La date de commande est invalide";
        }

        const parisDate = new Date(
            now.toLocaleString("en-US", { timeZone: "Europe/Paris" }),
        );

        const day = parisDate.getDay();

        const currentTime = `${String(parisDate.getHours()).padStart(2, "0")}:${String(
            parisDate.getMinutes(),
        ).padStart(2, "0")}`;

        const intervals = brand.openingHours[day] ?? [];

        const isOpen = intervals.some(
            (interval) =>
                currentTime >= interval.open && currentTime < interval.close,
        );

        if (!isOpen) {
            return "L'enseigne est actuellement fermée";
        }

        return null;
    }
}