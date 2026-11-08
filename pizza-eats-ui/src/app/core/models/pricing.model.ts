export type PricingStrategy = 'standard' | 'happy-hour' | 'loyalty' | 'promo-code';

export const PRICING_STRATEGIES: { value: PricingStrategy; label: string }[] = [
  { value: 'standard', label: 'Prix standard' },
  { value: 'happy-hour', label: 'Happy Hour (-20 %)' },
  { value: 'loyalty', label: 'Fidélité (-10 %)' },
  { value: 'promo-code', label: 'Code promo' },
];

export interface PricingRequest {
  brandId: string;
  pizzas: { pizzaId: string; quantity: number; size: string }[];
  strategy: PricingStrategy;
  promoCode?: string;
}

export interface PricingLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PricingResult {
  brand: { id: string; name: string };
  pizzas: PricingLine[];
  total: number;
  promotion: { strategy: string; discount: number } | null;
  finalPrice: number;
}
