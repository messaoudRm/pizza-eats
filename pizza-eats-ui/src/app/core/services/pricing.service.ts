import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PricingRequest, PricingResult } from '../models/pricing.model';

// Prix et promotions (US2) : tout est calculé par l'API
@Injectable({ providedIn: 'root' })
export class PricingService {
  private http = inject(HttpClient);

  // POST /pricing/calculate
  calculate(request: PricingRequest): Observable<PricingResult> {
    return this.http.post<PricingResult>(`${environment.apiUrl}/pricing/calculate`, request);
  }
}
