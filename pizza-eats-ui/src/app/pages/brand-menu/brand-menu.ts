import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandMenu as BrandMenuModel } from '../../core/models/brand.model';
import { ApiMessage } from '../../core/models/cart.model';
import { CustomPizzaRequest } from '../../core/models/pizza.model';
import { BrandService } from '../../core/services/brand.service';
import { CartBrand, CartService } from '../../core/services/cart.service';
import { getTodayHours } from '../../core/opening-hours';
import { getErrorMessage } from '../../core/http-error';
import { PizzaCard, PizzaAddEvent } from '../../components/pizza-card/pizza-card';
import { PizzaComposer } from '../../components/pizza-composer/pizza-composer';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-brand-menu',
  imports: [RouterLink, PizzaCard, PizzaComposer, Icon],
  templateUrl: './brand-menu.html',
  styleUrl: './brand-menu.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class BrandMenu implements OnInit {
  private route = inject(ActivatedRoute);
  private brandService = inject(BrandService);
  private cartService = inject(CartService);

  brandId = '';
  menu: BrandMenuModel | null = null;
  loading = false;
  error = '';

  adding = false;
  addMessage = '';
  addError = '';
  // Enseigne déjà présente dans le panier (une seule enseigne par commande)
  conflictBrand: CartBrand | null = null;

  ngOnInit(): void {
    const brandId = this.route.snapshot.paramMap.get('brandId');
    if (brandId) {
      this.brandId = brandId;
    }
    this.loadMenu();
    this.cartService.refresh();
  }

  // GET /brands/:brandId/menu
  loadMenu(): void {
    this.loading = true;
    this.error = '';

    this.brandService.getMenu(this.brandId).subscribe({
      next: (menu) => {
        this.menu = menu;
        this.loading = false;
      },
      error: (error) => {
        this.error = getErrorMessage(error, 'Impossible de charger le menu.');
        this.loading = false;
      },
    });
  }

  getImage(): string {
    return this.brandService.getImage(this.brandId);
  }

  getTodayHours(): string {
    if (this.menu) {
      return getTodayHours(this.menu.openingHours);
    }
    return '';
  }

  getZones(): string {
    if (!this.menu) {
      return '';
    }
    const zones: string[] = [];
    for (const zone of this.menu.deliveryArrondissements) {
      zones.push(`${zone}e`);
    }
    return zones.join(', ');
  }

  // POST /cart/items
  addMenuPizza(event: PizzaAddEvent): void {
    const label = `${event.pizza.name} (${event.size})`;
    this.addToCart(this.cartService.addMenuPizza(event.pizza, event.size, 1), label);
  }

  // POST /cart/custom-pizzas
  addCustomPizza(request: CustomPizzaRequest): void {
    const label = `Pizza composée (${request.size})`;
    this.addToCart(this.cartService.addCustomPizza(request, 1), label);
  }

  // Vide le panier d'une autre enseigne pour pouvoir commander ici
  clearCart(): void {
    this.adding = true;
    this.cartService.getItems().subscribe({
      next: (items) => {
        this.cartService.clear(items).subscribe({
          next: () => {
            this.conflictBrand = null;
            this.adding = false;
            this.addError = '';
            this.addMessage = 'Panier vidé. Vous pouvez ajouter vos pizzas.';
            this.cartService.refresh();
          },
          error: (error) => {
            this.addError = getErrorMessage(error, 'Impossible de vider le panier.');
            this.adding = false;
          },
        });
      },
      error: (error) => {
        this.addError = getErrorMessage(error, 'Impossible de lire le panier.');
        this.adding = false;
      },
    });
  }

  private addToCart(request: Observable<ApiMessage>, label: string): void {
    this.addMessage = '';
    this.addError = '';

    if (this.cartService.hasOtherBrand(this.brandId)) {
      this.conflictBrand = this.cartService.getBrand();
      return;
    }

    this.adding = true;
    request.subscribe({
      next: () => {
        if (this.menu) {
          this.cartService.setBrand({ id: this.menu.id, name: this.menu.name });
        }
        this.addMessage = `${label} ajoutée au panier.`;
        this.adding = false;
        this.cartService.refresh();
      },
      error: (error) => {
        this.addError = getErrorMessage(error, "Impossible d'ajouter la pizza au panier.");
        this.adding = false;
      },
    });
  }
}
