import { BrandFactory } from "../../domain/factories/BrandFactory";
import { BrandRegistry } from "../../domain/registries/BrandRegistry";

export class BrandService {
  // us 1 : la liste des enseignes vient du registry, aucune liste en dur
  getAllBrands() {
    return BrandRegistry.getAll().map((id) => {
      const brand = BrandFactory.create(id);

      return {
        id: brand.id,
        name: brand.name,
      };
    });
  }

  getBrandMenu(brandId: string) {
    const brand = BrandFactory.create(brandId);

    return {
      id: brand.id,
      name: brand.name,
      menu: brand.getMenu().map((pizza) => ({
        id: pizza.id,
        name: pizza.name,
        description: pizza.description,
        price: brand.calculatePrice(pizza),
      })),
    };
  }
}
