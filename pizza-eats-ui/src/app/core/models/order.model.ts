export type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'CONFIRMED', label: 'Confirmée' },
  { value: 'PREPARING', label: 'En préparation' },
  { value: 'OUT_FOR_DELIVERY', label: 'En livraison' },
  { value: 'DELIVERED', label: 'Livrée' },
  { value: 'CANCELLED', label: 'Annulée' },
];

export function getStatusLabel(status: OrderStatus): string {
  for (const item of ORDER_STATUSES) {
    if (item.value === status) {
      return item.label;
    }
  }
  return status;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customerEmail: string;
  createdAt: string;
}

export interface OrderValidationRequest {
  brandId: string;
  customerEmail: string;
  deliveryArrondissement: number;
  total: number;
  currentDateTime?: string;
  pizzas: { pizzaId: string; quantity: number }[];
}

export interface OrderValidationResult {
  valid: boolean;
  message: string;
  orderId?: string;
}

export interface StatusUpdateResult {
  success: boolean;
  message: string;
  orderId: string;
  status: OrderStatus;
}

// Commande en cours de paiement, conservée entre les pages panier, paiement et confirmation
export interface CurrentOrder {
  orderId: string;
  brandName: string;
  amount: number;
  paymentMessage: string;
  paymentSuccess: boolean;
}
