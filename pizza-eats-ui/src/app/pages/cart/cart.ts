import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandMenu } from '../../core/models/brand.model';
import { ApiMessage, CartItem as CartItemModel } from '../../core/models/cart.model';
import { PRICING_STRATEGIES, PricingResult, PricingStrategy } from '../../core/models/pricing.model';
import { OrderValidationRequest } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { BrandService } from '../../core/services/brand.service';
import { CartBrand, CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PricingService } from '../../core/services/pricing.service';
import { SimulatedTime, findOpeningSlot } from '../../core/opening-hours';
import { getErrorMessage } from '../../core/http-error';
import { CartItem } from '../../components/cart-item/cart-item';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, FormsModule, RouterLink, CartItem, Icon],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Cart implements OnInit {
  private authService = inject(AuthService);
  private brandService = inject(BrandService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private pricingService = inject(PricingService);
  private router = inject(Router);

  items: CartItemModel[] = [];
  brand: CartBrand | null = null;
  menu: BrandMenu | null = null;
  loading = false;
  busy = false;
  error = '';
  info = '';

  // Promotion (US2)
  strategies = PRICING_STRATEGIES;
  strategy: PricingStrategy = 'standard';
  promoCode = '';
  pricing: PricingResult | null = null;
  pricingLoading = false;
  pricingError = '';

  // Livraison et validation (US3)
  arrondissements: number[] = [];
  arrondissement = 1;
  simulatedTime: SimulatedTime | null = null;
  ordering = false;
  orderError = '';

  ngOnInit(): void {
    for (let i = 1; i <= 20; i++) {
      this.arrondissements.push(i);
    }
    this.loadCart();
  }

  // GET /cart, puis le menu de l'enseigne et le prix
  loadCart(): void {
    this.loading = true;
    this.error = '';

    this.cartService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.brand = this.cartService.getBrand();
        this.loading = false;
        this.loadMenu();
        this.calculatePrice();
      },
      error: (error) => {
        this.error = getErrorMessage(error, 'Impossible de charger le panier.');
        this.loading = false;
      },
    });
  }

  // GET /brands/:brandId/menu : horaires et zones de livraison de l'enseigne
  loadMenu(): void {
    if (this.brand === null || this.menu !== null) {
      return;
    }
    this.brandService.getMenu(this.brand.id).subscribe({
      next: (menu) => {
        this.menu = menu;
        if (menu.deliveryArrondissements.length > 0) {
          this.arrondissement = menu.deliveryArrondissements[0];
        }
      },
      error: () => {
        this.menu = null;
      },
    });
  }

  // POST /pricing/calculate : le total vient toujours de l'API
  calculatePrice(): void {
    this.pricingError = '';

    if (this.items.length === 0 || this.brand === null) {
      this.pricing = null;
      return;
    }
    if (this.strategy === 'promo-code' && this.promoCode.trim() === '') {
      this.pricing = null;
      this.pricingError = 'Saisissez un code promo, puis appliquez-le.';
      return;
    }

    let promoCode: string | undefined = undefined;
    if (this.strategy === 'promo-code') {
      promoCode = this.promoCode.trim();
    }

    this.pricingLoading = true;
    this.pricingService
      .calculate({
        brandId: this.brand.id,
        pizzas: this.getPricingLines(),
        strategy: this.strategy,
        promoCode,
      })
      .subscribe({
        next: (pricing) => {
          this.pricing = pricing;
          this.pricingLoading = false;
        },
        error: (error) => {
          this.pricing = null;
          this.pricingError = getErrorMessage(error, 'Impossible de calculer le total.');
          this.pricingLoading = false;
        },
      });
  }

  selectStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
    if (strategy !== 'promo-code') {
      this.calculatePrice();
    } else {
      this.pricing = null;
      this.pricingError = '';
    }
  }

  // Total d'une ligne, renvoyé par l'API (même ordre que les articles envoyés)
  getLineTotal(index: number): number | null {
    if (this.pricing && this.pricing.pizzas[index]) {
      return this.pricing.pizzas[index].totalPrice;
    }
    return null;
  }

  isCustom(item: CartItemModel): boolean {
    return this.cartService.isCustomPizza(item);
  }

  // POST /cart/items : "+1"
  increase(item: CartItemModel): void {
    this.runCartAction(this.cartService.addItem(item.pizza, item.size, 1), '');
  }

  // DELETE /cart/items/:pizzaId
  remove(item: CartItemModel): void {
    this.runCartAction(this.cartService.removeItem(item), `${item.pizza.name} retirée du panier.`);
  }

  // PATCH /cart/items/:pizzaId/size
  changeSize(item: CartItemModel, size: string): void {
    this.runCartAction(this.cartService.updateSize(item, size), '');
  }

  // POST /cart/undo
  undo(): void {
    this.runCartAction(this.cartService.undo(), '');
  }

  // POST /cart/redo
  redo(): void {
    this.runCartAction(this.cartService.redo(), '');
  }

  // Bouton "Simuler une heure" : envoie une heure comprise dans les horaires d'ouverture
  toggleSimulatedTime(): void {
    this.orderError = '';
    if (this.simulatedTime) {
      this.simulatedTime = null;
      return;
    }
    if (this.menu) {
      this.simulatedTime = findOpeningSlot(this.menu.openingHours);
    }
    if (this.simulatedTime === null) {
      this.orderError = "Impossible de trouver un horaire d'ouverture pour cette enseigne.";
    }
  }

  getZonesHint(): string {
    if (!this.menu) {
      return '';
    }
    const zones: string[] = [];
    for (const zone of this.menu.deliveryArrondissements) {
      zones.push(`${zone}e`);
    }
    return `${this.menu.name} livre le ${zones.join(', ')}.`;
  }

  // POST /orders/validate, puis vidage du panier et passage au paiement
  validateOrder(): void {
    if (this.pricing === null || this.brand === null) {
      return;
    }
    const brand = this.brand;
    const pricing = this.pricing;

    const request: OrderValidationRequest = {
      brandId: brand.id,
      customerEmail: this.authService.getEmail(),
      deliveryArrondissement: Number(this.arrondissement),
      total: pricing.total,
      pizzas: this.getOrderLines(),
    };
    if (this.simulatedTime) {
      request.currentDateTime = this.simulatedTime.iso;
    }

    this.ordering = true;
    this.orderError = '';

    this.orderService.validate(request).subscribe({
      next: (result) => {
        if (!result.valid || !result.orderId) {
          this.orderError = result.message;
          this.ordering = false;
          return;
        }
        this.orderService.setCurrentOrder({
          orderId: result.orderId,
          brandName: brand.name,
          amount: pricing.finalPrice,
          paymentMessage: '',
          paymentSuccess: false,
        });
        this.cartService.clear(this.items).subscribe({
          next: () => {
            this.cartService.refresh();
            this.router.navigate(['/payment']);
          },
          error: () => {
            this.router.navigate(['/payment']);
          },
        });
      },
      error: (error) => {
        this.orderError = getErrorMessage(error, 'La commande a été refusée.');
        this.ordering = false;
      },
    });
  }

  // Lignes envoyées à /pricing/calculate : la taille change le prix
  private getPricingLines(): { pizzaId: string; quantity: number; size: string }[] {
    return this.items.map((item) => ({ pizzaId: item.pizza.id, quantity: item.quantity, size: item.size }));
  }

  private getOrderLines(): { pizzaId: string; quantity: number }[] {
    return this.items.map((item) => ({ pizzaId: item.pizza.id, quantity: item.quantity }));
  }

  private runCartAction(action: Observable<ApiMessage>, successInfo: string): void {
    this.busy = true;
    this.error = '';
    this.info = '';

    action.subscribe({
      next: (result) => {
        this.busy = false;
        if (!result.success) {
          this.info = result.message;
        } else {
          this.info = successInfo;
        }
        this.loadCart();
      },
      error: (error) => {
        this.error = getErrorMessage(error, "L'action sur le panier a échoué.");
        this.busy = false;
      },
    });
  }
}
