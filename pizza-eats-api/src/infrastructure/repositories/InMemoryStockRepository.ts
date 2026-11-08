import { BrandFactory } from "../../domain/factories/BrandFactory";
import { StockRepository } from "../../domain/repositories/StockRepository";

// Stock en mémoire : initialisé à partir du menu de chaque enseigne,
// remis à zéro au redémarrage de l'API
export class InMemoryStockRepository implements StockRepository {
    private stocks = new Map<string, number>();

    getStock(brandId: string, pizzaId: string): number {
        const key = `${brandId}:${pizzaId}`;
        const stock = this.stocks.get(key);

        if (stock !== undefined) {
            return stock;
        }

        // Première lecture : stock initial défini dans la classe de l'enseigne
        const pizza = BrandFactory.create(brandId).getPizzaById(pizzaId);
        const initialStock = pizza ? pizza.stock : 0;

        this.stocks.set(key, initialStock);

        return initialStock;
    }

    decrement(brandId: string, pizzaId: string, quantity: number): void {
        const current = this.getStock(brandId, pizzaId);

        this.stocks.set(`${brandId}:${pizzaId}`, Math.max(0, current - quantity));
    }

    // Remise en stock (commande annulée)
    increment(brandId: string, pizzaId: string, quantity: number): void {
        const current = this.getStock(brandId, pizzaId);

        this.stocks.set(`${brandId}:${pizzaId}`, current + quantity);
    }
}
