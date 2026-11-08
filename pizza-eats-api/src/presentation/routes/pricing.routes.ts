import { FastifyInstance } from "fastify";
import { PricingService } from "../../application/services/PricingService";
import { PricingController, PricingRequest } from "../controllers/PricingController";
import { PricingStrategyRegistry } from "../../domain/pricing/PricingStrategyRegistry";

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
                            // us 2 : la liste vient du registry, rien à modifier ici pour une nouvelle stratégie
                            enum: PricingStrategyRegistry.getAll(),
                        },
                        promoCode: {
                            type: "string",
                            description: "Code promo (obligatoire si strategy = promo-code)",
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