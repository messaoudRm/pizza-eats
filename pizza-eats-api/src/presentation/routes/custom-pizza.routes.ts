import { FastifyInstance } from "fastify";
import { CustomPizzaService } from "../../application/services/CustomPizzaService";
import { CustomPizzaController } from "../controllers/CustomPizzaController";

export async function customPizzaRoutes(app: FastifyInstance) {
    const service = new CustomPizzaService();
    const controller = new CustomPizzaController(service);

    app.post("/pizzas/customize", {
        schema: {
            tags: ["Pricing"],
            body: {
                type: "object",
                required: ["brandId", "base", "size", "ingredients"],
                properties: {
                    brandId: { type: "string" },
                    base: {
                        type: "string",
                        enum: ["tomato", "cream"],
                    },
                    size: {
                        type: "string",
                        enum: ["S", "M", "L", "XL"],
                    },
                    ingredients: {
                        type: "array",
                        items: {
                            type: "string",
                            enum: [
                                "mozzarella",
                                "pepperoni",
                                "mushrooms",
                                "ham",
                                "olives",
                                "gorgonzola",
                            ],
                        },
                    },
                },
            },
        },
    }, async (request, reply) => {
        try {
            const result = controller.customizePizza(
                request.body as {
                    brandId: string;
                    base: "tomato" | "cream";
                    size: "S" | "M" | "L" | "XL";
                    ingredients: (
                        | "mozzarella"
                        | "pepperoni"
                        | "mushrooms"
                        | "ham"
                        | "olives"
                        | "gorgonzola"
                        )[];
                },
            );

            return reply.code(200).send(result);
        } catch (error) {
            return reply.code(400).send({
                error: error instanceof Error ? error.message : "Invalid custom pizza",
            });
        }
    });
}
