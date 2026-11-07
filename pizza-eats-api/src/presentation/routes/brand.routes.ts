import { FastifyInstance } from "fastify";
import { BrandService } from "../../application/services/BrandService";
import { BrandController } from "../controllers/BrandController";

export async function brandRoutes(app: FastifyInstance) {
  const brandService = new BrandService();
  const brandController = new BrandController(brandService);

  // GET /brands
  app.get(
    "/brands",
    {
      schema: {
        tags: ["Brands"],
        summary: "Récupérer la liste des enseignes",
      },
    },
    async () => {
      return brandController.getAllBrands();
    },
  );

  // GET /brands/:brandId/menu
  app.get<{ Params: { brandId: string } }>(
    "/brands/:brandId/menu",
    {
      schema: {
        tags: ["Brands"],
        summary: "Récupérer le menu d'une enseigne",
        params: {
          type: "object",
          required: ["brandId"],
          properties: {
            brandId: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        return brandController.getBrandMenu(request.params.brandId);
      } catch {
        return reply.status(404).send({
          status: "error",
          message: `Brand "${request.params.brandId}" not found`,
        });
      }
    },
  );
}
