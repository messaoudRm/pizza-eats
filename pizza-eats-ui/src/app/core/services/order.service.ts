import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CurrentOrder,
  Order,
  OrderStatus,
  OrderValidationRequest,
  OrderValidationResult,
  StatusUpdateResult,
} from '../models/order.model';

const CURRENT_ORDER_KEY = 'pizza-eats.current-order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/orders`;

  // POST /orders/validate
  validate(request: OrderValidationRequest): Observable<OrderValidationResult> {
    return this.http.post<OrderValidationResult>(`${this.url}/validate`, request);
  }

  // GET /orders/history?customerEmail=&status=
  getHistory(customerEmail: string, status: OrderStatus | ''): Observable<Order[]> {
    let params = new HttpParams().set('customerEmail', customerEmail);
    if (status !== '') {
      params = params.set('status', status);
    }
    return this.http.get<Order[]>(`${this.url}/history`, { params });
  }

  // PATCH /orders/:orderId/status
  updateStatus(orderId: string, status: OrderStatus, customerEmail: string): Observable<StatusUpdateResult> {
    return this.http.patch<StatusUpdateResult>(`${this.url}/${orderId}/status`, { status, customerEmail });
  }

  // Commande en cours (entre panier, paiement et confirmation)
  getCurrentOrder(): CurrentOrder | null {
    const value = sessionStorage.getItem(CURRENT_ORDER_KEY);
    if (value) {
      return JSON.parse(value) as CurrentOrder;
    }
    return null;
  }

  setCurrentOrder(order: CurrentOrder): void {
    sessionStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(order));
  }
}
