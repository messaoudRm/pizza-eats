
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

import { OrderValidationService } from "../../application/services/OrderValidationService";
import { OrderController } from "../controllers/OrderController";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { Order } from "../../domain/entities/Order";
import { OrderStatus } from "../../domain/entities/OrderStatus";

type OrderRequest = {
    brandId: string;
    customerEmail: string;
    deliveryArrondissement: number;
    total: number;
    currentDateTime?: string;
    pizzas: {
        pizzaId: string;
        quantity: number;
    }[];
};

type OrderRouteOptions = {
    orderRepository: OrderRepository;
};

export async function orderRoutes(
    app: FastifyInstance,
    options: OrderRouteOptions,
) {
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
                    required: [
                        "brandId",
                        "customerEmail",
                        "deliveryArrondissement",
                        "total",
                        "pizzas",
                    ],
                    properties: {
                        brandId: { type: "string" },
                        customerEmail: { type: "string", format: "email" },
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

                if (!result.valid) {
                    return reply.status(400).send(result);
                }

                // Création de la commande après validation réussie
                const order = new Order(
                    randomUUID(),
                    OrderStatus.CONFIRMED,
                    request.body.customerEmail,
                );

                // Enregistrement de la commande dans le repository partagé
                options.orderRepository.save(order);

                return reply.status(200).send({
                    ...result,
                    orderId: order.id,
                });
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
