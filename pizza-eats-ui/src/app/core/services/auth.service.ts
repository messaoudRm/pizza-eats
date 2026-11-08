import { Injectable } from '@angular/core';

const EMAIL_KEY = 'pizza-eats.email';

// L'API n'a pas d'endpoint d'authentification : l'email est conservé côté client
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string): void {
    localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
  }

  logout(): void {
    localStorage.removeItem(EMAIL_KEY);
  }

  getEmail(): string {
    const email = localStorage.getItem(EMAIL_KEY);
    if (email) {
      return email;
    }
    return '';
  }

  isLoggedIn(): boolean {
    return this.getEmail() !== '';
  }
}
