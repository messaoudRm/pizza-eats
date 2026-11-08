import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ORDER_STATUSES, Order, OrderStatus } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { getErrorMessage } from '../../core/http-error';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-order-history',
  imports: [DatePipe, RouterLink, StatusBadge, Icon],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OrderHistory implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  orders: Order[] = [];
  statuses = ORDER_STATUSES;
  status: OrderStatus | '' = '';
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  selectStatus(status: OrderStatus | ''): void {
    this.status = status;
    this.loadOrders();
  }

  // GET /orders/history (tri par date décroissante fait par l'API)
  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getHistory(this.authService.getEmail(), this.status).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        this.error = getErrorMessage(error, "Impossible de charger l'historique.");
        this.loading = false;
      },
    });
  }

  getShortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }
}
