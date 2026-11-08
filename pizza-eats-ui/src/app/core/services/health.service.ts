import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private http = inject(HttpClient);

  // GET /health
  check(): Observable<{ status: string; message: string }> {
    return this.http.get<{ status: string; message: string }>(`${environment.apiUrl}/health`);
  }
}
