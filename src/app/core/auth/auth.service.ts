import { computed, Injectable, signal } from '@angular/core';

import { DEMO_CREDENTIALS } from './demo-credentials';

/**
 * Simulated sign-in for the challenge.
 *
 * This is not a security boundary and must not be described as one. The
 * credentials and the signed-in flag both live in the browser, so everything
 * the guard protects is reachable by anyone willing to edit application state.
 * A real application checks credentials on a server and holds a token the
 * client cannot forge; this exists only to demonstrate the login, guard,
 * redirect and logout flow.
 *
 * State is held in memory, so a refresh signs the user out. Persistence is
 * deliberately out of scope.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly signedInEmailState = signal<string | null>(null);

  readonly signedInEmail = this.signedInEmailState.asReadonly();

  /** Derived, so there is no second flag that could disagree with the email. */
  readonly isAuthenticated = computed(() => this.signedInEmailState() !== null);

  /**
   * Signs in when the credentials match, and reports whether they did so the
   * caller can show feedback.
   *
   * The email is trimmed and compared case-insensitively, since neither is
   * meaningful in an address. The password is compared exactly.
   */
  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return false;
    }

    this.signedInEmailState.set(normalizedEmail);

    return true;
  }

  logout(): void {
    this.signedInEmailState.set(null);
  }
}
