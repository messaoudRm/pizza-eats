import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem as CartItemModel } from '../../core/models/cart.model';
import { PIZZA_SIZES } from '../../core/models/pizza.model';
import { Icon } from '../icon/icon';

// Une ligne du panier : taille, "+1", suppression. Le total de la ligne vient de l'API.
@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe, Icon],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CartItem {
  item = input.required<CartItemModel>();
  lineTotal = input<number | null>(null);
  isCustom = input<boolean>(false);
  busy = input<boolean>(false);

  increase = output<void>();
  remove = output<void>();
  sizeChange = output<string>();

  sizes = PIZZA_SIZES;

  onSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sizeChange.emit(select.value);
  }
}
