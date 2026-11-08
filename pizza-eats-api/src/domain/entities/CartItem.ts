import { Pizza } from "./Pizza";

export class CartItem {
    constructor(
        public readonly pizza: Pizza,
        public quantity: number,
        public size: string,
    ) {}
}