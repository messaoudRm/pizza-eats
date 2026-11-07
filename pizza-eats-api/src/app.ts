import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { healthRoutes } from "./presentation/routes/health.routes";

export async function buildApp() {
    const app = Fastify({
        logger: true,
    });

    // Configuration Swagger
    await app.register(swagger, {
        openapi: {
            info: {
                title: "Pizza Eats API",
                description: "API REST de la marketplace Pizza Eats",
                version: "1.0.0",
            },
        },
    });

    // Interface Swagger UI
    await app.register(swaggerUI, {
        routePrefix: "/docs",
    });

    // Enregistrement des routes
    await app.register(healthRoutes);

    return app;
}