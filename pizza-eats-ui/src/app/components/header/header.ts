import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { HealthService } from '../../core/services/health.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Header implements OnInit {
  private authService = inject(AuthService);
  private healthService = inject(HealthService);
  private router = inject(Router);
  cartService = inject(CartService);

  // État de l'API : 'checking' | 'online' | 'offline'
  apiState = 'checking';

  ngOnInit(): void {
    this.cartService.refresh();
    this.healthService.check().subscribe({
      next: () => {
        this.apiState = 'online';
      },
      error: () => {
        this.apiState = 'offline';
      },
    });
  }

  getEmail(): string {
    return this.authService.getEmail();
  }

  getApiLabel(): string {
    if (this.apiState === 'online') {
      return 'API en ligne';
    }
    if (this.apiState === 'offline') {
      return 'API hors ligne';
    }
    return 'Connexion à l’API…';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
