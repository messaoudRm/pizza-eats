export interface CartPizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  stock: number;
}

export interface CartItem {
  pizza: CartPizza;
  quantity: number;
  size: string;
}

export interface ApiMessage {
  success: boolean;
  message: string;
}
