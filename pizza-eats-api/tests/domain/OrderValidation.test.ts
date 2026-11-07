
import { describe, it, expect } from "vitest";
import { OrderValidationService } from "../../src/application/services/OrderValidationService";
import "../../src/domain/brands/registerBrands";

describe("OrderValidationService", () => {
    const service = new OrderValidationService();

    it("should reject an empty cart", () => {
        const result = service.validate({
            brandId: "da-michele",
            deliveryArrondissement: 11,
            total: 20,
            pizzas: [],
        });

        expect(result).toBe("Le panier est vide");
    });

    it("should reject an order below the minimum amount", () => {
        const result = service.validate({
            brandId: "da-michele",
            deliveryArrondissement: 11,
            total: 10,
            pizzas: [{ pizzaId: "dm-1", quantity: 1 }],
        });

        expect(result).toBe("Le montant minimum de la commande est de 15 €");
    });

    it("should reject an order outside the delivery zone", () => {
        const result = service.validate({
            brandId: "da-michele",
            deliveryArrondissement: 15,
            total: 20,
            pizzas: [{ pizzaId: "dm-1", quantity: 1 }],
        });

        expect(result).toBe(
            "L'adresse de livraison est en dehors de la zone desservie par cette enseigne",
        );
    });

    it("should reject an order when the brand is closed", () => {
        const result = service.validate({
            brandId: "da-michele",
            deliveryArrondissement: 11,
            total: 20,
            currentDateTime: "2026-11-09T12:00:00+01:00",
            pizzas: [{ pizzaId: "dm-1", quantity: 1 }],
        });

        expect(result).toBe("L'enseigne est actuellement fermée");
    });

    it("should reject an order when stock is insufficient", () => {
        const result = service.validate({
            brandId: "da-michele",
            deliveryArrondissement: 11,
            total: 150,
            currentDateTime: "2026-11-07T12:00:00+01:00",
            pizzas: [{ pizzaId: "dm-1", quantity: 11 }],
        });

        expect(result).toBe(
            "Stock insuffisant pour Margherita. Stock disponible : 10",
        );
    });

    it("should accept a valid order", () => {
        const result = service.validate({
            brandId: "da-michele",
            deliveryArrondissement: 11,
            total: 20,
            currentDateTime: "2026-11-07T12:00:00+01:00",
            pizzas: [{ pizzaId: "dm-1", quantity: 2 }],
        });

        expect(result).toBeNull();
    });
});
