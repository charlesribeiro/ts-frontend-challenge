import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { DEMO_CREDENTIALS } from './demo-credentials';

/** Neither guard reads the route or state, so empty stand-ins are enough. */
function runGuard(guard: CanActivateFn) {
  return TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('auth guards', () => {
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    authService = TestBed.inject(AuthService);
  });

  function signIn(): void {
    authService.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  }

  describe('authGuard', () => {
    it('lets a signed-in user through', () => {
      signIn();

      expect(runGuard(authGuard)).toBe(true);
    });

    it('sends a signed-out visitor to the login page', () => {
      const result = runGuard(authGuard);

      expect(result).toBeInstanceOf(UrlTree);
      expect(String(result)).toBe('/login');
    });

    it('turns a user away again once they have signed out', () => {
      signIn();
      authService.logout();

      const result = runGuard(authGuard);

      expect(result).toBeInstanceOf(UrlTree);
      expect(String(result)).toBe('/login');
    });
  });

  describe('guestGuard', () => {
    it('lets a signed-out visitor reach the login page', () => {
      expect(runGuard(guestGuard)).toBe(true);
    });

    it('sends a signed-in user to the deals page', () => {
      signIn();

      const result = runGuard(guestGuard);

      expect(result).toBeInstanceOf(UrlTree);
      expect(String(result)).toBe('/deals');
    });
  });
});
