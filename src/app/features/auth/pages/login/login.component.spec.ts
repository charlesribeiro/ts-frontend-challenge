import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { DEMO_CREDENTIALS } from '../../../../core/auth/demo-credentials';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let host: HTMLElement;
  let authService: AuthService;
  let navigate: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function requireElement<T extends Element>(selector: string): T {
    const element = host.querySelector<T>(selector);

    if (element === null) {
      throw new Error(`Expected the template to contain ${selector}`);
    }

    return element;
  }

  function fill(selector: string, value: string): void {
    const input = requireElement<HTMLInputElement>(selector);

    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submit(): void {
    requireElement<HTMLFormElement>('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('renders labelled email and password fields', () => {
    expect(requireElement<HTMLInputElement>('#email').type).toBe('email');
    expect(requireElement<HTMLInputElement>('#password').type).toBe('password');
    expect(requireElement('label[for="email"]').textContent).toContain('Email');
    expect(requireElement('label[for="password"]').textContent).toContain('Password');
  });

  it('shows the demo credentials so a reviewer can sign in', () => {
    expect(host.textContent).toContain(DEMO_CREDENTIALS.email);
    expect(host.textContent).toContain(DEMO_CREDENTIALS.password);
  });

  it('asks for both fields when submitted empty, without signing in', () => {
    submit();

    expect(host.textContent).toContain('Enter your email address.');
    expect(host.textContent).toContain('Enter your password.');
    expect(requireElement('#email-error').getAttribute('role')).toBe('alert');
    expect(requireElement('#password-error').getAttribute('role')).toBe('alert');
    expect(document.activeElement).toBe(requireElement('#email'));
    expect(authService.isAuthenticated()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('asks for a valid email when the address is malformed', () => {
    fill('#email', 'not-an-email');
    fill('#password', DEMO_CREDENTIALS.password);

    submit();

    expect(host.textContent).toContain('Enter a valid email address');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('reports rejected credentials in an alert without signing in', () => {
    fill('#email', DEMO_CREDENTIALS.email);
    fill('#password', 'not-the-password');

    submit();

    expect(requireElement('[role="alert"]').textContent).toContain('did not recognise');
    expect(authService.isAuthenticated()).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('clears only the password after a rejected attempt', () => {
    fill('#email', DEMO_CREDENTIALS.email);
    fill('#password', 'not-the-password');

    submit();

    expect(requireElement<HTMLInputElement>('#password').value).toBe('');
    expect(requireElement<HTMLInputElement>('#email').value).toBe(DEMO_CREDENTIALS.email);
  });

  it('signs in and opens the deals page with the demo credentials', () => {
    fill('#email', DEMO_CREDENTIALS.email);
    fill('#password', DEMO_CREDENTIALS.password);

    submit();

    expect(authService.isAuthenticated()).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/deals']);
  });

  it('drops the rejection alert once a successful attempt follows', () => {
    fill('#email', DEMO_CREDENTIALS.email);
    fill('#password', 'not-the-password');
    submit();

    fill('#password', DEMO_CREDENTIALS.password);
    submit();

    expect(host.querySelector('[role="alert"]')).toBeNull();
  });
});
