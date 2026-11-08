
import { FastifyInstance } from "fastify";
import { CartService } from "../../application/services/CartService";
import { CartController } from "../controllers/CartController";
import { Pizza } from "../../domain/entities/Pizza";

type AddCartItemRequest = {
    pizza: {
        id: string;
        name: string;
        description: string;
        basePrice: number;
        stock: number;
    };
    quantity: number;
    size: string;
};

type RemoveCartItemRequest = {
    size: string;
};

type UpdateCartSizeRequest = {
    oldSize: string;
    newSize: string;
};

export async function cartRoutes(app: FastifyInstance) {
    const cartService = new CartService();
    const cartController = new CartController(cartService);

    // Consulter le panier
    app.get(
        "/cart",
        {
            schema: {
                tags: ["Cart"],
                summary: "Consulter le panier",
            },
        },
        async (_request, reply) => {
            return reply.status(200).send(cartController.getItems());
        },
    );

    // Ajouter une pizza
    app.post<{ Body: AddCartItemRequest }>(
        "/cart/items",
        {
            schema: {
                tags: ["Cart"],
                summary: "Ajouter une pizza au panier",
                body: {
                    type: "object",
                    required: ["pizza", "quantity", "size"],
                    properties: {
                        pizza: {
                            type: "object",
                            required: ["id", "name", "description", "basePrice", "stock"],
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                description: { type: "string" },
                                basePrice: { type: "number" },
                                stock: { type: "integer" },
                            },
                        },
                        quantity: { type: "integer", minimum: 1 },
                        size: { type: "string" },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const { pizza, quantity, size } = request.body;

                const result = cartController.addItem(
                    new Pizza(
                        pizza.id,
                        pizza.name,
                        pizza.description,
                        pizza.basePrice,
                        pizza.stock,
                    ),
                    quantity,
                    size,
                );

                return reply.status(201).send(result);
            } catch (error) {
                return reply.status(400).send({
                    success: false,
                    message: error instanceof Error ? error.message : "Erreur",
                });
            }
        },
    );

    // Supprimer une pizza
    app.delete<{ Params: { pizzaId: string }; Body: RemoveCartItemRequest }>(
        "/cart/items/:pizzaId",
        {
            schema: {
                tags: ["Cart"],
                summary: "Supprimer une pizza du panier",
                body: {
                    type: "object",
                    required: ["size"],
                    properties: {
                        size: { type: "string" },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const result = cartController.removeItem(
                    request.params.pizzaId,
                    request.body.size,
                );

                return reply.status(200).send(result);
            } catch (error) {
                return reply.status(400).send({
                    success: false,
                    message: error instanceof Error ? error.message : "Erreur",
                });
            }
        },
    );

    // Modifier la taille d'une pizza
    app.patch<{ Params: { pizzaId: string }; Body: UpdateCartSizeRequest }>(
        "/cart/items/:pizzaId/size",
        {
            schema: {
                tags: ["Cart"],
                summary: "Modifier la taille d'une pizza",
                body: {
                    type: "object",
                    required: ["oldSize", "newSize"],
                    properties: {
                        oldSize: { type: "string" },
                        newSize: { type: "string" },
                    },
                },
            },
        },
        async (request, reply) => {
            try {
                const result = cartController.updateSize(
                    request.params.pizzaId,
                    request.body.oldSize,
                    request.body.newSize,
                );

                return reply.status(200).send(result);
            } catch (error) {
                return reply.status(400).send({
                    success: false,
                    message: error instanceof Error ? error.message : "Erreur",
                });
            }
        },
    );

    // Annuler la dernière modification
    app.post(
        "/cart/undo",
        {
            schema: {
                tags: ["Cart"],
                summary: "Annuler la dernière modification du panier",
            },
        },
        async (_request, reply) => {
            return reply.status(200).send(cartController.undo());
        },
    );

    // Rétablir une modification annulée
    app.post(
        "/cart/redo",
        {
            schema: {
                tags: ["Cart"],
                summary: "Rétablir la dernière modification annulée",
            },
        },
        async (_request, reply) => {
            return reply.status(200).send(cartController.redo());
        },
    );
}
