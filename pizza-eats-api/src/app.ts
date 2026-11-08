import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import "./domain/brands/registerBrands";

import { healthRoutes } from "./presentation/routes/health.routes";
import { brandRoutes } from "./presentation/routes/brand.routes";
import { pricingRoutes } from "./presentation/routes/pricing.routes";
import { orderRoutes } from "./presentation/routes/order.routes";
import { paymentRoutes } from "./presentation/routes/payment.routes";
import { orderNotificationRoutes } from "./presentation/routes/order-notification.routes";
import { cartRoutes } from "./presentation/routes/cart.routes";

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
    await app.register(brandRoutes);
    await app.register(pricingRoutes);
    await app.register(orderRoutes);
    await app.register(paymentRoutes);
    await app.register(orderNotificationRoutes);
    await app.register(cartRoutes);

    return app;
}