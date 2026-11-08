import { Ingredient, PizzaBase, PizzaSize } from "../entities/CustomPizza";

export type CustomPizzaDefinition = {
    base: PizzaBase;
    size: PizzaSize;
    ingredients: Ingredient[];
};

const PREFIX = "custom";
const BASES: PizzaBase[] = ["tomato", "cream"];
const SIZES: PizzaSize[] = ["S", "M", "L", "XL"];
const INGREDIENTS: Ingredient[] = [
    "mozzarella",
    "pepperoni",
    "mushrooms",
    "ham",
    "olives",
    "gorgonzola",
];

// Identifiant d'une pizza composée, qui encode sa composition.
// Exemple : "custom:tomato:L:ham+mozzarella"
// Il permet d'ajouter une pizza composée au panier, puis de la retrouver
// lors du calcul du prix et de la validation de la commande.
export class CustomPizzaId {
    static encode(definition: CustomPizzaDefinition): string {
        const ingredients = [...definition.ingredients].sort().join("+");

        return `${PREFIX}:${definition.base}:${definition.size}:${ingredients}`;
    }

    static decode(id: string): CustomPizzaDefinition | null {
        const parts = id.split(":");

        if (parts.length !== 4 || parts[0] !== PREFIX) {
            return null;
        }

        const base = parts[1] as PizzaBase;
        const size = parts[2] as PizzaSize;
        const ingredients = (parts[3] === "" ? [] : parts[3].split("+")) as Ingredient[];

        if (!BASES.includes(base) || !SIZES.includes(size)) {
            return null;
        }

        if (!ingredients.every((ingredient) => INGREDIENTS.includes(ingredient))) {
            return null;
        }

        return { base, size, ingredients };
    }
}
