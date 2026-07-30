import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

/** Chrome around every protected page: navigation, who is signed in, and the way out. */
@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly signedInEmail = this.authService.signedInEmail;

  /**
   * Guards run when a navigation is resolved, not when state changes underneath
   * one, so signing out has to navigate away from the protected page itself.
   */
  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
