import { CartItem } from "./CartItem";

export class CartMemento {
    private readonly items: CartItem[];

    constructor(items: CartItem[]) {
        this.items = items.map(
            item => new CartItem(item.pizza, item.quantity, item.size)
        );
    }

    getItems(): CartItem[] {
        return this.items.map(
            item => new CartItem(item.pizza, item.quantity, item.size)
        );
    }
}