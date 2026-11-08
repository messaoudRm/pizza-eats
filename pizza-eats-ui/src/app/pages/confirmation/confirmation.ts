import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CurrentOrder } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-confirmation',
  imports: [CurrencyPipe, RouterLink, Icon],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Confirmation implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);

  order: CurrentOrder | null = null;

  ngOnInit(): void {
    this.order = this.orderService.getCurrentOrder();
    if (this.order === null) {
      this.router.navigate(['/home']);
    }
  }
}
