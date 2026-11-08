import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentOrder } from '../../core/models/order.model';
import { PAYMENT_METHODS, PaymentMethod } from '../../core/models/payment.model';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { getErrorMessage } from '../../core/http-error';
import { Icon, IconName } from '../../components/icon/icon';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, Icon],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Payment implements OnInit {
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  order: CurrentOrder | null = null;
  methods = PAYMENT_METHODS;
  method: PaymentMethod = 'credit-card';
  paying = false;
  error = '';

  ngOnInit(): void {
    this.order = this.orderService.getCurrentOrder();
    if (this.order === null) {
      this.router.navigate(['/cart']);
    }
  }

  selectMethod(method: PaymentMethod): void {
    this.method = method;
  }

  getIcon(method: PaymentMethod): IconName {
    if (method === 'credit-card') {
      return 'card';
    }
    if (method === 'paypal') {
      return 'wallet';
    }
    return 'cash';
  }

  // POST /payments
  pay(): void {
    if (this.order === null) {
      return;
    }
    const order = this.order;
    this.paying = true;
    this.error = '';

    this.paymentService.pay(this.method, order.amount).subscribe({
      next: (result) => {
        order.paymentMessage = result.message;
        order.paymentSuccess = result.success;
        this.orderService.setCurrentOrder(order);
        this.router.navigate(['/confirmation']);
      },
      error: (error) => {
        this.error = getErrorMessage(error, 'Le paiement a échoué. Réessayez.');
        this.paying = false;
      },
    });
  }
}
