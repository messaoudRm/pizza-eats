import { describe, it, expect } from "vitest";
import { PizzaBuilder } from "../../src/domain/customization/PizzaBuilder";

describe("CustomPizza - Builder and Decorator", () => {

    it("should create a basic tomato pizza for 5€", () => {
        const pizza = new PizzaBuilder()
            .setBase("tomato")
            .setSize("M")
            .build();

        expect(pizza.getPrice()).toBe(5);
        expect(pizza.getDescription()).toBe("Pizza base tomato, taille M");
    });

    it("should create a cream pizza", () => {
        const pizza = new PizzaBuilder()
            .setBase("cream")
            .build();

        expect(pizza.getDescription()).toBe("Pizza base cream, taille M");
        expect(pizza.getPrice()).toBe(5);
    });

    it("should add mozzarella for 1.50€", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("mozzarella")
            .build();

        expect(pizza.getPrice()).toBe(6.5);
        expect(pizza.getDescription()).toContain("Mozzarella");
    });

    it("should add pepperoni for 2€", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("pepperoni")
            .build();

        expect(pizza.getPrice()).toBe(7);
        expect(pizza.getDescription()).toContain("Pepperoni");
    });

    it("should add mushrooms for 1€", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("mushrooms")
            .build();

        expect(pizza.getPrice()).toBe(6);
        expect(pizza.getDescription()).toContain("Champignons");
    });

    it("should add ham for 2€", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("ham")
            .build();

        expect(pizza.getPrice()).toBe(7);
        expect(pizza.getDescription()).toContain("Jambon");
    });

    it("should add olives for 1€", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("olives")
            .build();

        expect(pizza.getPrice()).toBe(6);
        expect(pizza.getDescription()).toContain("Olives");
    });

    it("should add gorgonzola for 2.50€", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("gorgonzola")
            .build();

        expect(pizza.getPrice()).toBe(7.5);
        expect(pizza.getDescription()).toContain("Gorgonzola");
    });

    it("should combine multiple ingredients", () => {
        const pizza = new PizzaBuilder()
            .addIngredient("mozzarella")
            .addIngredient("pepperoni")
            .addIngredient("mushrooms")
            .build();

        expect(pizza.getPrice()).toBe(9.5);
        expect(pizza.getDescription()).toContain("Mozzarella");
        expect(pizza.getDescription()).toContain("Pepperoni");
        expect(pizza.getDescription()).toContain("Champignons");
    });

    it("should allow XL size", () => {
        const pizza = new PizzaBuilder()
            .setSize("XL")
            .build();

        expect(pizza.getDescription()).toBe("Pizza base tomato, taille XL");
    });
});
