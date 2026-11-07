import { Brand } from "../entities/Brand";
import { BrandRegistry } from "../registries/BrandRegistry";

export class BrandFactory {
    static create(id: string): Brand {
        const BrandClass = BrandRegistry.get(id);

        return new BrandClass();
    }
}