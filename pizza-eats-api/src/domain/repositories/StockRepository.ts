// Stock restant de chaque pizza, par enseigne
export interface StockRepository {
    getStock(brandId: string, pizzaId: string): number;

    decrement(brandId: string, pizzaId: string, quantity: number): void;

    increment(brandId: string, pizzaId: string, quantity: number): void;
}
