import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Asegurar que la sesión desde Preferences ya fue leída
  if (!authService.inicializado()) {
    await authService.inicializarSesion();
  }

  if (authService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
