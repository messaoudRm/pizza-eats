export interface Brand {
  id: string;
  name: string;
}

export interface OpeningInterval {
  open: string;
  close: string;
}

// Clé = jour de la semaine (0 = dimanche ... 6 = samedi)
export type OpeningHours = Record<string, OpeningInterval[]>;

export interface MenuPizza {
  id: string;
  name: string;
  description: string;
  // Prix de la taille M
  price: number;
  // Stock restant, décrémenté par l'API à chaque commande validée
  stock: number;
  // Prix par taille, calculés par l'API selon les multiplicateurs de l'enseigne
  prices: { S: number; M: number; L: number; XL: number };
}

export interface BrandMenu {
  id: string;
  name: string;
  openingHours: OpeningHours;
  deliveryArrondissements: number[];
  menu: MenuPizza[];
}
