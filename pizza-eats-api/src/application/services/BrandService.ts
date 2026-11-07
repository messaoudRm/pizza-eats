import { BrandFactory } from "../../domain/factories/BrandFactory";

export class BrandService {
    private readonly brandIds = [
        "da-michele",
        "rossopomodoro",
        "pizzium",
        "dominos-pizza",
        "pizza-hut",
    ];

  getAllBrands() {
    return this.brandIds.map((id) => {
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
