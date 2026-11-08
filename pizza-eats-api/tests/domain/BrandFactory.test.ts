import { describe, it, expect } from "vitest";
import "../../src/domain/brands/registerBrands";
import { BrandFactory } from "../../src/domain/factories/BrandFactory";
import { BrandRegistry } from "../../src/domain/registries/BrandRegistry";
import { BrandService } from "../../src/application/services/BrandService";
import { Brand } from "../../src/domain/entities/Brand";
import { Pizza } from "../../src/domain/entities/Pizza";

describe("BrandFactory", () => {
  it("should create Da Michele", () => {
    const brand = BrandFactory.create("da-michele");

    expect(brand.name).toBe("Da Michele");
  });

  it("should create Rossopomodoro", () => {
    const brand = BrandFactory.create("rossopomodoro");

    expect(brand.name).toBe("Rossopomodoro");
  });

  it("should create Pizzium", () => {
    const brand = BrandFactory.create("pizzium");

    expect(brand.name).toBe("Pizzium");
  });

  it("should apply Da Michele pricing rules", () => {
    const brand = BrandFactory.create("da-michele");
    const pizza = brand.getMenu()[0];

    expect(brand.calculatePrice(pizza)).toBe(10);
  });

  it("should apply Rossopomodoro pricing rules", () => {
    const brand = BrandFactory.create("rossopomodoro");
    const pizza = brand.getMenu()[0];

    expect(brand.calculatePrice(pizza)).toBeCloseTo(12.1);
  });

  it("should apply Pizzium pricing rules", () => {
    const brand = BrandFactory.create("pizzium");
    const pizza = brand.getMenu()[0];

    expect(brand.calculatePrice(pizza)).toBeCloseTo(8.1);
  });

  it("should list all registered brands without a hardcoded list", () => {
    const ids = new BrandService().getAllBrands().map((brand) => brand.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        "da-michele",
        "rossopomodoro",
        "pizzium",
        "dominos-pizza",
        "pizza-hut",
      ]),
    );
  });

  it("should list a new brand once its class is registered", () => {
    // us 1 : ajouter une enseigne = ajouter une classe (+ l'enregistrer)
    class TestBrand extends Brand {
      constructor() {
        super("test-brand", "Test Brand", [new Pizza("tb-1", "Test", "Test", 10, 5)], [1], {}, { S: 1, M: 1, L: 1, XL: 1 });
      }

      calculatePrice(pizza: Pizza): number {
        return pizza.basePrice;
      }
    }

    BrandRegistry.register("test-brand", TestBrand);

    const brands = new BrandService().getAllBrands();

    expect(brands).toContainEqual({ id: "test-brand", name: "Test Brand" });
  });
});
