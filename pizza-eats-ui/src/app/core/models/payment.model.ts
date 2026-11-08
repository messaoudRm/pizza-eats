export type PaymentMethod = 'credit-card' | 'paypal' | 'cash-on-delivery';

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'credit-card', label: 'Carte bancaire', description: 'Paiement en ligne par carte' },
  { value: 'paypal', label: 'PayPal', description: 'Paiement via votre compte PayPal' },
  { value: 'cash-on-delivery', label: 'Espèces', description: 'Vous payez le livreur à la réception' },
];

export interface PaymentResult {
  success: boolean;
  message: string;
}
