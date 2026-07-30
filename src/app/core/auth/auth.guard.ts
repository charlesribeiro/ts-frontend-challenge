import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Keeps signed-out visitors out of protected routes.
 *
 * Returns a `UrlTree` rather than navigating, so the router treats the
 * redirect as part of resolving the original navigation instead of as a second
 * one, which keeps the browser history clean.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

/** Sends already signed-in users away from the login page, which has nothing left to offer them. */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? router.createUrlTree(['/deals']) : true;
};
