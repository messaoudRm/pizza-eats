import { FastifyInstance } from "fastify";
import { PricingService } from "../../application/services/PricingService";
import { PricingController } from "../controllers/PricingController";

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

export async function pricingRoutes(app: FastifyInstance) {
    const pricingService = new PricingService();
    const pricingController = new PricingController(pricingService);

    app.post<{ Body: PricingRequest }>(
        "/pricing/calculate",
        {
            schema: {
                tags: ["Pricing"],
                summary: "Calculer le prix d'une commande avec une promotion",
                body: {
                    type: "object",
                    required: ["brandId", "pizzas", "strategy"],
                    properties: {
                        brandId: { type: "string" },
                        pizzas: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                required: ["pizzaId", "quantity"],
                                properties: {
                                    pizzaId: { type: "string" },
                                    quantity: { type: "integer", minimum: 1 },
                                },
                            },
                        },
                        strategy: {
                            type: "string",
                            enum: ["standard", "happy-hour", "loyalty", "promo-code"],
                        },
                        discountType: {
                            type: "string",
                            enum: ["percentage", "fixed"],
                        },
                        discountValue: {
                            type: "number",
                            minimum: 0,
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                return pricingController.calculatePrice(request.body);
            } catch (error) {
                return reply.status(400).send({
                    status: "error",
                    message:
                        error instanceof Error ? error.message : "Invalid pricing request",
                });
            }
        },
    );
}