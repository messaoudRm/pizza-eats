import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentMethod, PaymentResult } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  // POST /payments
  pay(method: PaymentMethod, amount: number): Observable<PaymentResult> {
    return this.http.post<PaymentResult>(`${environment.apiUrl}/payments`, { method, amount });
  }
}
