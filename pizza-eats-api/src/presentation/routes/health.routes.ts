import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
    app.get(
        "/health",
        {
            schema: {
                tags: ["Health"],
                summary: "Vérifier le fonctionnement de l'API",
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        async () => {
            return {
                status: "ok",
                message: "Pizza Eats API is running",
            };
        },
    );
}