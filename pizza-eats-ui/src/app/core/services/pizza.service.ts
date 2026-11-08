import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomPizzaRequest, CustomPizzaResult } from '../models/pizza.model';

@Injectable({ providedIn: 'root' })
export class PizzaService {
  private http = inject(HttpClient);

  // POST /pizzas/customize : prix d'une pizza composée, calculé par l'API
  customize(request: CustomPizzaRequest): Observable<CustomPizzaResult> {
    return this.http.post<CustomPizzaResult>(`${environment.apiUrl}/pizzas/customize`, request);
  }
}
