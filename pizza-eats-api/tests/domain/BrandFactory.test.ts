import { describe, it, expect } from "vitest";
import "../../src/domain/brands/registerBrands";
import { BrandFactory } from "../../src/domain/factories/BrandFactory";

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
});
