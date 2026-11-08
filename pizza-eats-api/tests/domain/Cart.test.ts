import { describe, it, expect, beforeEach } from "vitest";
import { Cart } from "../../src/domain/entities/Cart";
import { Pizza } from "../../src/domain/entities/Pizza";

describe("Cart - Memento pattern (Undo/Redo)", () => {
    let cart: Cart;
    let pizza: Pizza;

    beforeEach(() => {
        cart = new Cart();

        pizza = new Pizza(
            "pizza-1",
            "Margherita",
            "Tomate, mozzarella",
            10,
            20,
        );
    });

    it("should add a pizza to the cart", () => {
        cart.addItem(pizza, 2, "L");

        expect(cart.getItems()).toHaveLength(1);
        expect(cart.getItems()[0].quantity).toBe(2);
    });

    it("should remove a pizza from the cart", () => {
        cart.addItem(pizza, 1, "L");
        cart.removeItem("pizza-1", "L");

        expect(cart.getItems()).toHaveLength(0);
    });

    it("should undo an added pizza", () => {
        cart.addItem(pizza, 1, "L");

        expect(cart.undo()).toBe(true);
        expect(cart.getItems()).toHaveLength(0);
    });

    it("should undo a removed pizza", () => {
        cart.addItem(pizza, 1, "L");
        cart.removeItem("pizza-1", "L");

        expect(cart.undo()).toBe(true);
        expect(cart.getItems()).toHaveLength(1);
    });

    it("should undo a size modification", () => {
        cart.addItem(pizza, 1, "M");
        cart.updateSize("pizza-1", "M", "L");

        expect(cart.undo()).toBe(true);
        expect(cart.getItems()[0].size).toBe("M");
    });

    it("should redo an undone modification", () => {
        cart.addItem(pizza, 1, "L");

        cart.undo();
        cart.redo();

        expect(cart.getItems()).toHaveLength(1);
        expect(cart.getItems()[0].size).toBe("L");
    });

    it("should not undo when history is empty", () => {
        expect(cart.undo()).toBe(false);
    });

    it("should not redo when redo history is empty", () => {
        expect(cart.redo()).toBe(false);
    });

    it("should clear redo history after a new modification", () => {
        cart.addItem(pizza, 1, "L");
        cart.undo();

        cart.addItem(pizza, 2, "M");

        expect(cart.redo()).toBe(false);
        expect(cart.getItems()[0].quantity).toBe(2);
    });

    it("should keep only the 10 most recent modifications", () => {
        for (let i = 1; i <= 11; i++) {
            cart.addItem(pizza, 1, `size-${i}`);
        }

        for (let i = 0; i < 10; i++) {
            expect(cart.undo()).toBe(true);
        }

        expect(cart.getItems()).toHaveLength(1);
        expect(cart.getItems()[0].size).toBe("size-1");

        expect(cart.undo()).toBe(false);
    });

    it("should not save history when removing a non-existing pizza", () => {
        cart.addItem(pizza, 1, "L");

        cart.removeItem("pizza-inexistante", "L");

        expect(cart.undo()).toBe(true);
        expect(cart.getItems()).toHaveLength(0);
        expect(cart.undo()).toBe(false);
    });

    it("should not save history when updating to the same size", () => {
        cart.addItem(pizza, 1, "L");

        cart.updateSize("pizza-1", "L", "L");

        expect(cart.undo()).toBe(true);
        expect(cart.getItems()).toHaveLength(0);
        expect(cart.undo()).toBe(false);
    });

});