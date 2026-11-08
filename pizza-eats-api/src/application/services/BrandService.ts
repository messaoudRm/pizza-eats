import { BrandFactory } from "../../domain/factories/BrandFactory";
import { BrandRegistry } from "../../domain/registries/BrandRegistry";
import { StockRepository } from "../../domain/repositories/StockRepository";

export class BrandService {
  constructor(private readonly stockRepository?: StockRepository) {}

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
      openingHours: brand.openingHours,
      deliveryArrondissements: brand.deliveryArrondissements,
      menu: brand.getMenu().map((pizza) => ({
        id: pizza.id,
        name: pizza.name,
        description: pizza.description,
        price: brand.calculatePrice(pizza),
        // Stock restant (sans repository : stock initial du menu)
        stock: this.stockRepository
          ? this.stockRepository.getStock(brand.id, pizza.id)
          : pizza.stock,
        prices: {
          S: brand.calculatePriceForSize(pizza, "S"),
          M: brand.calculatePriceForSize(pizza, "M"),
          L: brand.calculatePriceForSize(pizza, "L"),
          XL: brand.calculatePriceForSize(pizza, "XL"),
        },
      })),
    };
  }
}
