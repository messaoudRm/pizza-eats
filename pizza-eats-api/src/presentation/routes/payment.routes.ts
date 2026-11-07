import { FastifyInstance } from "fastify";
import { PaymentService } from "../../application/services/PaymentService";
import { PaymentController } from "../controllers/PaymentController";

type PaymentRequest = {
    method: "credit-card" | "cash-on-delivery" | "paypal";
    amount: number;
};

export async function paymentRoutes(app: FastifyInstance) {
    const paymentService = new PaymentService();
    const paymentController = new PaymentController(paymentService);

    app.post<{ Body: PaymentRequest }>(
        "/payments",
        {
            schema: {
                tags: ["Payments"],
                summary: "Effectuer un paiement simulé",
                body: {
                    type: "object",
                    required: ["method", "amount"],
                    properties: {
                        method: {
                            type: "string",
                            enum: ["credit-card", "cash-on-delivery", "paypal"],
                        },
                        amount: { type: "number" },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const result = paymentController.pay(
                    request.body.method,
                    request.body.amount,
                );

                return reply.status(200).send(result);
            } catch (error) {
                return reply.status(400).send({
                    success: false,
                    message:
                        error instanceof Error ? error.message : "Payment failed",
                });
            }
        },
    );
}