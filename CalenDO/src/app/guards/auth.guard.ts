import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in for protected routes
  if (authService.isLoggedIn) {
    return true;
  }
  
  // Redirect to the login page if not logged in
  return router.parseUrl('/login');
};