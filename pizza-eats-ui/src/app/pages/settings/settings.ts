import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NOTIFICATION_LISTENERS, NotificationListener } from '../../core/models/notification.model';
import { NotificationService } from '../../core/services/notification.service';
import { getErrorMessage } from '../../core/http-error';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-settings',
  imports: [Icon],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Settings {
  private notificationService = inject(NotificationService);

  listeners = NOTIFICATION_LISTENERS;
  // Listener en cours de mise à jour ('' = aucun)
  updating = '';
  error = '';
  message = '';

  isEnabled(listener: NotificationListener): boolean {
    return this.notificationService.isEnabled(listener);
  }

  // PATCH /orders/notifications/:listener
  toggle(listener: NotificationListener, label: string): void {
    const enabled = !this.isEnabled(listener);
    this.updating = listener;
    this.error = '';
    this.message = '';

    this.notificationService.toggle(listener, enabled).subscribe({
      next: () => {
        if (enabled) {
          this.message = `${label} activé.`;
        } else {
          this.message = `${label} désactivé.`;
        }
        this.updating = '';
      },
      error: (error) => {
        this.error = getErrorMessage(error, 'Impossible de modifier cette notification.');
        this.updating = '';
      },
    });
  }
}
