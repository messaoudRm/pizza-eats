import { PricingStrategy } from "./strategies/PricingStrategy";

export type PricingOptions = {
    promoCode?: string;
};

type PricingStrategyFactory = (options: PricingOptions) => PricingStrategy;

// us 2 : facile d'ajouter une nouvelle stratégie = ajouter une classe + l'enregistrer
export class PricingStrategyRegistry {
    private static strategies = new Map<string, PricingStrategyFactory>();

    static register(name: string, factory: PricingStrategyFactory): void {
        this.strategies.set(name, factory);
    }

    static create(name: string, options: PricingOptions = {}): PricingStrategy {
        const factory = this.strategies.get(name);

        if (!factory) {
            throw new Error(`Stratégie de prix "${name}" inconnue`);
        }

        return factory(options);
    }

    static getAll(): string[] {
        return [...this.strategies.keys()];
    }
}
