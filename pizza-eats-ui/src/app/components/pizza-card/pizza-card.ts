import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MenuPizza } from '../../core/models/brand.model';
import { PIZZA_SIZES, PizzaSize } from '../../core/models/pizza.model';
import { Icon } from '../icon/icon';

export interface PizzaAddEvent {
  pizza: MenuPizza;
  size: PizzaSize;
}

// Une pizza du menu : choix de la taille puis ajout au panier
@Component({
  selector: 'app-pizza-card',
  imports: [CurrencyPipe, Icon],
  templateUrl: './pizza-card.html',
  styleUrl: './pizza-card.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PizzaCard {
  pizza = input.required<MenuPizza>();
  busy = input<boolean>(false);
  add = output<PizzaAddEvent>();

  sizes = PIZZA_SIZES;
  selectedSize: PizzaSize = 'M';

  selectSize(size: PizzaSize): void {
    this.selectedSize = size;
  }

  isSoldOut(): boolean {
    return this.pizza().stock <= 0;
  }

  // Stock faible : on prévient le client à partir de 3 pizzas restantes
  isLowStock(): boolean {
    return this.pizza().stock > 0 && this.pizza().stock <= 3;
  }

  // Prix de la taille sélectionnée, renvoyé par l'API
  getPrice(): number {
    return this.pizza().prices[this.selectedSize];
  }

  onAdd(): void {
    this.add.emit({ pizza: this.pizza(), size: this.selectedSize });
  }
}
