
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

import { OrderValidationService } from "../../application/services/OrderValidationService";
import { OrderController } from "../controllers/OrderController";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { Order } from "../../domain/entities/Order";
import { OrderStatus } from "../../domain/entities/OrderStatus";
import { StockRepository } from "../../domain/repositories/StockRepository";
import { CustomPizzaId } from "../../domain/customization/CustomPizzaId";

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
    stockRepository: StockRepository;
};

export async function orderRoutes(
    app: FastifyInstance,
    options: OrderRouteOptions,
) {
    const orderValidationService = new OrderValidationService(options.stockRepository);
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
                    new Date(),
                    request.body.brandId,
                    request.body.pizzas.map((item) => ({
                        pizzaId: item.pizzaId,
                        quantity: item.quantity,
                    })),
                );

                // Enregistrement de la commande dans le repository partagé
                options.orderRepository.save(order);

                // Commande validée : le stock des pizzas du menu diminue
                // (une pizza composée est préparée à la demande, sans stock)
                for (const item of request.body.pizzas) {
                    if (!CustomPizzaId.decode(item.pizzaId)) {
                        options.stockRepository.decrement(
                            request.body.brandId,
                            item.pizzaId,
                            item.quantity,
                        );
                    }
                }

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
