import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiMessage } from '../models/cart.model';
import { NotificationListener } from '../models/notification.model';

const SETTINGS_KEY = 'pizza-eats.notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);

  // PATCH /orders/notifications/:listener
  toggle(listener: NotificationListener, enabled: boolean): Observable<ApiMessage> {
    return this.http
      .patch<ApiMessage>(`${environment.apiUrl}/orders/notifications/${listener}`, { enabled })
      .pipe(tap(() => this.saveState(listener, enabled)));
  }

  // L'API n'expose pas l'état des listeners : on garde le dernier choix côté client
  // (au démarrage de l'API, les trois listeners sont actifs)
  isEnabled(listener: NotificationListener): boolean {
    const settings = this.readSettings();
    if (settings[listener] === false) {
      return false;
    }
    return true;
  }

  private saveState(listener: NotificationListener, enabled: boolean): void {
    const settings = this.readSettings();
    settings[listener] = enabled;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  private readSettings(): Record<string, boolean> {
    const value = localStorage.getItem(SETTINGS_KEY);
    if (value) {
      return JSON.parse(value) as Record<string, boolean>;
    }
    return {};
  }
}
