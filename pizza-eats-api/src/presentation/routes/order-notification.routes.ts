import { FastifyInstance } from "fastify";
import { OrderStatus } from "../../domain/entities/OrderStatus";
import { OrderNotificationController } from "../controllers/OrderNotificationController";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { StockRepository } from "../../domain/repositories/StockRepository";

type UpdateStatusRequest = {
    orderId: string;
};

type UpdateStatusBody = {
    status: OrderStatus;
    customerEmail: string;
};

type ToggleListenerRequest = {
    listener: "email" | "sms" | "push";
};

type ToggleListenerBody = {
    enabled: boolean;
};

type OrderNotificationRouteOptions = {
    orderRepository: OrderRepository;
    stockRepository: StockRepository;
};

export async function orderNotificationRoutes(
    app: FastifyInstance,
    options: OrderNotificationRouteOptions,
) {
    const controller = new OrderNotificationController(
        options.orderRepository,
        options.stockRepository,
    );

    app.patch<{
        Params: UpdateStatusRequest;
        Body: UpdateStatusBody;
    }>(
        "/orders/:orderId/status",
        {
            schema: {
                tags: ["Orders"],
                summary: "Modifier le statut d'une commande et notifier les listeners",
                params: {
                    type: "object",
                    required: ["orderId"],
                    properties: {
                        orderId: { type: "string" },
                    },
                },
                body: {
                    type: "object",
                    required: ["status", "customerEmail"],
                    properties: {
                        status: {
                            type: "string",
                            enum: Object.values(OrderStatus),
                        },
                        customerEmail: {
                            type: "string",
                            format: "email",
                            description: "Adresse email du client",
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            const result = await controller.updateStatus(
                request.params.orderId,
                request.body.status,
                request.body.customerEmail,
            );

            return reply.status(200).send(result);
        },
    );

    app.patch<{
        Params: ToggleListenerRequest;
        Body: ToggleListenerBody;
    }>(
        "/orders/notifications/:listener",
        {
            schema: {
                tags: ["Orders"],
                summary: "Activer ou désactiver un listener",
                params: {
                    type: "object",
                    required: ["listener"],
                    properties: {
                        listener: {
                            type: "string",
                            enum: ["email", "sms", "push"],
                        },
                    },
                },
                body: {
                    type: "object",
                    required: ["enabled"],
                    properties: {
                        enabled: { type: "boolean" },
                    },
                },
            },
        },
        async (request, reply) => {
            controller.toggleListener(
                request.params.listener,
                request.body.enabled,
            );

            return reply.status(200).send({
                success: true,
                message: `Listener ${request.params.listener} ${
                    request.body.enabled ? "activé" : "désactivé"
                }`,
            });
        },
    );
}
