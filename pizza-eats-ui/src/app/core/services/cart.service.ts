import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiMessage, CartItem, CartPizza } from '../models/cart.model';
import { CustomPizzaRequest, PizzaSize } from '../models/pizza.model';
import { MenuPizza } from '../models/brand.model';

const BRAND_KEY = 'pizza-eats.cart-brand';

export interface CartBrand {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/cart`;

  // Nombre d'articles, affiché dans le header
  itemCount = 0;

  // GET /cart
  getItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.url).pipe(
      tap((items) => this.updateState(items)),
    );
  }

  // Recharge le panier pour mettre à jour le compteur du header
  refresh(): void {
    this.getItems().subscribe({ error: () => {} });
  }

  // POST /cart/items : pizza du menu (l'API attend basePrice et stock, le menu ne renvoie que price)
  addMenuPizza(pizza: MenuPizza, size: PizzaSize, quantity: number): Observable<ApiMessage> {
    const cartPizza: CartPizza = {
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      basePrice: pizza.prices[size],
      stock: 0,
    };
    return this.addItem(cartPizza, size, quantity);
  }

  // POST /cart/items : ajoute un exemplaire d'un article déjà dans le panier ("+")
  addItem(pizza: CartPizza, size: string, quantity: number): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.url}/items`, { pizza, quantity, size });
  }

  // POST /cart/custom-pizzas : pizza composée, prix calculé par l'API
  addCustomPizza(request: CustomPizzaRequest, quantity: number): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.url}/custom-pizzas`, {
      brandId: request.brandId,
      base: request.base,
      size: request.size,
      ingredients: request.ingredients,
      quantity,
    });
  }

  // DELETE /cart/items/:pizzaId
  removeItem(item: CartItem): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.url}/items/${encodeURIComponent(item.pizza.id)}`, {
      body: { size: item.size },
    });
  }

  // PATCH /cart/items/:pizzaId/size
  updateSize(item: CartItem, newSize: string): Observable<ApiMessage> {
    return this.http.patch<ApiMessage>(`${this.url}/items/${encodeURIComponent(item.pizza.id)}/size`, {
      oldSize: item.size,
      newSize,
    });
  }

  // POST /cart/undo
  undo(): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.url}/undo`, {});
  }

  // POST /cart/redo
  redo(): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.url}/redo`, {});
  }

  // Vide le panier en supprimant chaque article (pas d'endpoint dédié)
  clear(items: CartItem[]): Observable<ApiMessage[]> {
    if (items.length === 0) {
      return of([]);
    }
    const requests = items.map((item) => this.removeItem(item));
    return forkJoin(requests);
  }

  isCustomPizza(item: CartItem): boolean {
    return item.pizza.id.startsWith('custom:');
  }

  // Une commande ne concerne qu'une enseigne : on mémorise celle du panier
  getBrand(): CartBrand | null {
    const value = localStorage.getItem(BRAND_KEY);
    if (value) {
      return JSON.parse(value) as CartBrand;
    }
    return null;
  }

  setBrand(brand: CartBrand): void {
    localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
  }

  // Vrai si le panier contient déjà des pizzas d'une autre enseigne
  hasOtherBrand(brandId: string): boolean {
    const brand = this.getBrand();
    if (brand === null || this.itemCount === 0) {
      return false;
    }
    return brand.id !== brandId;
  }

  private updateState(items: CartItem[]): void {
    let count = 0;
    for (const item of items) {
      count = count + item.quantity;
    }
    this.itemCount = count;

    if (items.length === 0) {
      localStorage.removeItem(BRAND_KEY);
    }
  }
}
