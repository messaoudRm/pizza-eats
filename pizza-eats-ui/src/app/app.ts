import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Le header est masqué sur la page de connexion
  showHeader(): boolean {
    return this.authService.isLoggedIn() && !this.router.url.startsWith('/login');
  }
}
