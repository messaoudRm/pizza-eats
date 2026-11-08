import { HttpErrorResponse } from '@angular/common/http';

// Extrait le message d'erreur renvoyé par l'API, sinon un message par défaut
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return "L'API ne répond pas. Vérifiez qu'elle est démarrée.";
    }
    if (error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
  }
  return fallback;
}
