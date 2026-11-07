
import { FastifyInstance } from "fastify";
import { OrderValidationService } from "../../application/services/OrderValidationService";
import { OrderController } from "../controllers/OrderController";

type OrderRequest = {
    brandId: string;
    deliveryArrondissement: number;
    total: number;
    currentDateTime?: string;
    pizzas: {
        pizzaId: string;
        quantity: number;
    }[];
};

export async function orderRoutes(app: FastifyInstance) {
    const orderValidationService = new OrderValidationService();
    const orderController = new OrderController(orderValidationService);

    app.post<{ Body: OrderRequest }>(
        "/orders/validate",
        {
            schema: {
                tags: ["Orders"],
                summary: "Valider une commande",
                body: {
                    type: "object",
                    required: ["brandId", "deliveryArrondissement", "total", "pizzas"],
                    properties: {
                        brandId: { type: "string" },
                        deliveryArrondissement: {
                            type: "integer",
                            minimum: 1,
                            maximum: 20,
                        },
                        total: { type: "number", minimum: 0 },
                        currentDateTime: {
                            type: "string",
                            format: "date-time",
                        },
                        pizzas: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["pizzaId", "quantity"],
                                properties: {
                                    pizzaId: { type: "string" },
                                    quantity: { type: "integer", minimum: 1 },
                                },
                            },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const result = orderController.validateOrder(request.body);

                return reply.status(result.valid ? 200 : 400).send(result);
            } catch (error) {
                return reply.status(400).send({
                    valid: false,
                    message:
                        error instanceof Error ? error.message : "Invalid order",
                });
            }
        },
    );
}
