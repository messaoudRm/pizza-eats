import { FastifyInstance } from "fastify";
import { OrderHistoryService } from "../../application/services/OrderHistoryService";
import { OrderHistoryController } from "../controllers/OrderHistoryController";
import { OrderStatus } from "../../domain/entities/OrderStatus";
import { OrderRepository } from "../../domain/repositories/OrderRepository";

type OrderHistoryRouteOptions = {
    orderRepository: OrderRepository;
};

export async function orderHistoryRoutes(
    app: FastifyInstance,
    options: OrderHistoryRouteOptions,
) {
    const service = new OrderHistoryService(options.orderRepository);
    const controller = new OrderHistoryController(service);

    app.get("/orders/history", {
        schema: {
            tags: ["Orders"],
            querystring: {
                type: "object",
                required: ["customerEmail"],
                properties: {
                    customerEmail: { type: "string", format: "email" },
                    status: {
                        type: "string",
                        enum: Object.values(OrderStatus),
                    },
                },
            },
        },
    }, async (request, reply) => {
        const query = request.query as {
            customerEmail: string;
            status?: OrderStatus;
        };

        try {
            const orders = controller.getOrderHistory(
                query.customerEmail,
                query.status,
            );

            return reply.code(200).send(orders);
        } catch (error) {
            return reply.code(400).send({
                error: error instanceof Error
                    ? error.message
                    : "Unable to retrieve order history",
            });
        }
    });
}
