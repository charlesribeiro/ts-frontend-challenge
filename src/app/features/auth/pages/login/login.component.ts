import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { DEMO_CREDENTIALS } from '../../../../core/auth/demo-credentials';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Shown on the page so a reviewer does not have to read the source to sign in. */
  readonly demoCredentials = DEMO_CREDENTIALS;

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private readonly credentialsRejectedState = signal(false);

  readonly credentialsRejected = this.credentialsRejectedState.asReadonly();

  emailInvalid(): boolean {
    const email = this.form.controls.email;

    return email.touched && email.invalid;
  }

  passwordInvalid(): boolean {
    const password = this.form.controls.password;

    return password.touched && password.invalid;
  }

  submit(): void {
    this.credentialsRejectedState.set(false);

    if (this.form.invalid) {
      // Nothing is marked touched until the user visits a field, so an
      // untouched empty form would otherwise submit with no visible reason.
      this.form.markAllAsTouched();
      // Field errors use role="alert", but focus still sits on the submit
      // button; move it to the first invalid control so the failure is
      // announced rather than only painted on screen.
      this.focusFirstInvalidControl();

      return;
    }

    const { email, password } = this.form.getRawValue();

    if (!this.authService.login(email, password)) {
      this.credentialsRejectedState.set(true);
      this.form.controls.password.reset();

      return;
    }

    void this.router.navigate(['/deals']);
  }

  private focusFirstInvalidControl(): void {
    const controlId = this.form.controls.email.invalid
      ? 'email'
      : this.form.controls.password.invalid
        ? 'password'
        : null;

    if (controlId === null) {
      return;
    }

    const control = this.host.nativeElement.querySelector(`#${controlId}`);

    if (control instanceof HTMLElement) {
      control.focus();
    }
  }
}
