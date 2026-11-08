import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OrderStatus, getStatusLabel } from '../../core/models/order.model';

// Pastille de statut d'une commande
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class StatusBadge {
  status = input.required<OrderStatus>();

  getLabel(): string {
    return getStatusLabel(this.status());
  }

  getTone(): string {
    const status = this.status();
    if (status === 'DELIVERED') {
      return 'success';
    }
    if (status === 'CANCELLED') {
      return 'danger';
    }
    if (status === 'CONFIRMED') {
      return 'neutral';
    }
    return 'progress';
  }
}
