import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order, OrderStatus, getStatusLabel } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { getErrorMessage } from '../../core/http-error';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Icon } from '../../components/icon/icon';

const STEPS: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

@Component({
  selector: 'app-order-tracking',
  imports: [DatePipe, RouterLink, StatusBadge, Icon],
  templateUrl: './order-tracking.html',
  styleUrl: './order-tracking.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OrderTracking implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  orderId = '';
  order: Order | null = null;
  steps = STEPS;
  loading = false;
  error = '';
  notFound = false;

  updating = false;
  updateError = '';
  updateMessage = '';

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) {
      this.orderId = orderId;
    }
    this.loadOrder();
  }

  // GET /orders/history : l'API n'a pas d'endpoint de détail, on cherche la commande dans l'historique
  loadOrder(): void {
    this.loading = true;
    this.error = '';
    this.notFound = false;

    this.orderService.getHistory(this.authService.getEmail(), '').subscribe({
      next: (orders) => {
        this.order = null;
        for (const order of orders) {
          if (order.id === this.orderId) {
            this.order = order;
          }
        }
        if (this.order === null) {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = getErrorMessage(error, 'Impossible de charger la commande.');
        this.loading = false;
      },
    });
  }

  getLabel(status: OrderStatus): string {
    return getStatusLabel(status);
  }

  isStepDone(step: OrderStatus): boolean {
    if (this.order === null || this.order.status === 'CANCELLED') {
      return false;
    }
    return STEPS.indexOf(step) <= STEPS.indexOf(this.order.status);
  }

  isCurrentStep(step: OrderStatus): boolean {
    if (this.order === null) {
      return false;
    }
    return this.order.status === step;
  }

  // Étape suivante pour la simulation côté restaurant
  getNextStatus(): OrderStatus | null {
    if (this.order === null) {
      return null;
    }
    const index = STEPS.indexOf(this.order.status);
    if (index === -1 || index === STEPS.length - 1) {
      return null;
    }
    return STEPS[index + 1];
  }

  canCancel(): boolean {
    if (this.order === null) {
      return false;
    }
    return this.order.status !== 'DELIVERED' && this.order.status !== 'CANCELLED';
  }

  advance(): void {
    const next = this.getNextStatus();
    if (next) {
      this.updateStatus(next);
    }
  }

  cancel(): void {
    this.updateStatus('CANCELLED');
  }

  // PATCH /orders/:orderId/status : les listeners (email, SMS, push) sont notifiés côté API
  private updateStatus(status: OrderStatus): void {
    this.updating = true;
    this.updateError = '';
    this.updateMessage = '';

    this.orderService.updateStatus(this.orderId, status, this.authService.getEmail()).subscribe({
      next: (result) => {
        if (this.order) {
          this.order.status = result.status;
        }
        this.updateMessage = `Statut mis à jour : ${getStatusLabel(result.status)}. Les notifications actives ont été envoyées.`;
        this.updating = false;
      },
      error: (error) => {
        this.updateError = getErrorMessage(error, 'Impossible de mettre à jour le statut.');
        this.updating = false;
      },
    });
  }
}
