import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import "./domain/brands/registerBrands";
import "./domain/pricing/registerPricingStrategies";
import { InMemoryOrderRepository } from "./infrastructure/repositories/InMemoryOrderRepository";
import { InMemoryStockRepository } from "./infrastructure/repositories/InMemoryStockRepository";

import { healthRoutes } from "./presentation/routes/health.routes";
import { brandRoutes } from "./presentation/routes/brand.routes";
import { pricingRoutes } from "./presentation/routes/pricing.routes";
import { orderRoutes } from "./presentation/routes/order.routes";
import { paymentRoutes } from "./presentation/routes/payment.routes";
import { orderNotificationRoutes } from "./presentation/routes/order-notification.routes";
import { cartRoutes } from "./presentation/routes/cart.routes";
import { customPizzaRoutes } from "./presentation/routes/custom-pizza.routes";
import { orderHistoryRoutes } from "./presentation/routes/order-history.routes";

export async function buildApp() {
    const app = Fastify({
        logger: true,
    });

    // us9 Instance unique du repository, partagée entre les routes pour conserver les mêmes données pendant l'exécution de l'app
    const orderRepository = new InMemoryOrderRepository();

    // Stock restant des pizzas, partagé entre le menu et la validation des commandes
    const stockRepository = new InMemoryStockRepository();

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
    await app.register(brandRoutes, {
        stockRepository,
    });
    await app.register(pricingRoutes);
    await app.register(orderRoutes, {
        orderRepository,
        stockRepository,
    });
    await app.register(paymentRoutes);
    await app.register(orderNotificationRoutes, {
        orderRepository,
        stockRepository,
    });
    await app.register(cartRoutes);
    await app.register(customPizzaRoutes);
    await app.register(orderHistoryRoutes, {
        orderRepository,
    });

    return app;
}