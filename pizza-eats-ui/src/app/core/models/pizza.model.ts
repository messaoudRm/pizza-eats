export type PizzaBase = 'tomato' | 'cream';
export type PizzaSize = 'S' | 'M' | 'L' | 'XL';
export type Ingredient = 'mozzarella' | 'pepperoni' | 'mushrooms' | 'ham' | 'olives' | 'gorgonzola';

export const PIZZA_SIZES: PizzaSize[] = ['S', 'M', 'L', 'XL'];

export const PIZZA_BASES: { value: PizzaBase; label: string }[] = [
  { value: 'tomato', label: 'Tomate' },
  { value: 'cream', label: 'Crème' },
];

// Libellés et prix affichés (les prix sont fixés par l'API, US8)
export const INGREDIENTS: { value: Ingredient; label: string; price: number }[] = [
  { value: 'mozzarella', label: 'Mozzarella', price: 1.5 },
  { value: 'pepperoni', label: 'Pepperoni', price: 2 },
  { value: 'mushrooms', label: 'Champignons', price: 1 },
  { value: 'ham', label: 'Jambon', price: 2 },
  { value: 'olives', label: 'Olives', price: 1 },
  { value: 'gorgonzola', label: 'Gorgonzola', price: 2.5 },
];

export interface CustomPizzaRequest {
  brandId: string;
  base: PizzaBase;
  size: PizzaSize;
  ingredients: Ingredient[];
}

export interface CustomPizzaResult {
  brand: string;
  base: PizzaBase;
  size: PizzaSize;
  ingredients: Ingredient[];
  description: string;
  total: number;
}
