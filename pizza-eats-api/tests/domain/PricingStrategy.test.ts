import { describe, it, expect } from "vitest";
import { PricingController } from "../../src/presentation/controllers/PricingController";
import { PricingService } from "../../src/application/services/PricingService";
import "../../src/domain/brands/registerBrands";
import {PromoCodePricing} from "../../src/domain/pricing/strategies/PromoCodePricing";

// us7 Tests sur les stratégies de prix
describe("PricingController", () => {
    const controller = new PricingController(new PricingService());

    it("should calculate an order with multiple pizzas and Happy Hour", () => {
        const result = controller.calculatePrice({
            brandId: "da-michele",
            pizzas: [
                { pizzaId: "dm-1", quantity: 2 },
                { pizzaId: "dm-2", quantity: 1 },
            ],
            strategy: "happy-hour",
        });

        expect(result).toEqual({
            brand: {
                id: "da-michele",
                name: "Da Michele",
            },
            pizzas: [
                {
                    id: "dm-1",
                    name: "Margherita",
                    quantity: 2,
                    unitPrice: 10,
                    totalPrice: 20,
                },
                {
                    id: "dm-2",
                    name: "Marinara",
                    quantity: 1,
                    unitPrice: 8,
                    totalPrice: 8,
                },
            ],
            total: 28,
            promotion: {
                strategy: "happy-hour",
                discount: 5.6,
            },
            finalPrice: 22.4,
        });
    });

    it("should return null promotion with standard pricing", () => {
        const result = controller.calculatePrice({
            brandId: "da-michele",
            pizzas: [{ pizzaId: "dm-1", quantity: 2 }],
            strategy: "standard",
        });

        expect(result.promotion).toBeNull();
        expect(result.total).toBe(20);
        expect(result.finalPrice).toBe(20);
    });

    it("should apply a fixed promo code discount", () => {
        const result = controller.calculatePrice({
            brandId: "da-michele",
            pizzas: [{ pizzaId: "dm-1", quantity: 2 }],
            strategy: "promo-code",
            discountType: "fixed",
            discountValue: 5,
        });

        expect(result.total).toBe(20);
        expect(result.promotion).toEqual({
            strategy: "promo-code",
            discount: 5,
        });
        expect(result.finalPrice).toBe(15);
    });

    it("should reject an unknown pizza", () => {
        expect(() =>
            controller.calculatePrice({
                brandId: "da-michele",
                pizzas: [{ pizzaId: "unknown", quantity: 1 }],
                strategy: "standard",
            }),
        ).toThrow('Pizza "unknown" not found');
    });

    it("should reject an unknown brand", () => {
        expect(() =>
            controller.calculatePrice({
                brandId: "unknown-brand",
                pizzas: [{ pizzaId: "unknown", quantity: 1 }],
                strategy: "standard",
            }),
        ).toThrow('Brand "unknown-brand" is not registered');
    });

    it("should never return a negative price", () => {
        const strategy = new PromoCodePricing("fixed", 100);
        const service = new PricingService();

        const result = service.calculatePrice(20, strategy);

        expect(result.discount).toBe(20);
        expect(result.finalPrice).toBe(0);
    });

    it("should apply a 10% loyalty discount", () => {
        const result = controller.calculatePrice({
            brandId: "da-michele",
            pizzas: [{ pizzaId: "dm-1", quantity: 2 }],
            strategy: "loyalty",
        });

        expect(result.total).toBe(20);
        expect(result.promotion).toEqual({
            strategy: "loyalty",
            discount: 2,
        });
        expect(result.finalPrice).toBe(18);
    });
});