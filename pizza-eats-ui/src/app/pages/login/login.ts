import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Icon } from '../../components/icon/icon';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-login',
  imports: [FormsModule, Icon],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  error = '';

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  submit(): void {
    if (!EMAIL_PATTERN.test(this.email.trim())) {
      this.error = 'Saisissez une adresse email valide, par exemple nom@exemple.fr.';
      return;
    }
    this.error = '';
    this.authService.login(this.email);
    this.router.navigate(['/home']);
  }
}
