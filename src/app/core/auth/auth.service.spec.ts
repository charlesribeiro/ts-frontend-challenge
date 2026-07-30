import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { DEMO_CREDENTIALS } from './demo-credentials';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('is created signed out', () => {
    expect(service).toBeInstanceOf(AuthService);
    expect(service.isAuthenticated()).toBe(false);
    expect(service.signedInEmail()).toBeNull();
  });

  it('exposes the signed-in email as a read-only signal', () => {
    expect('set' in service.signedInEmail).toBe(false);
  });

  it('signs in with the demo credentials', () => {
    expect(service.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toBe(true);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.signedInEmail()).toBe(DEMO_CREDENTIALS.email);
  });

  it('ignores case and surrounding whitespace in the email', () => {
    const untidyEmail = `  ${DEMO_CREDENTIALS.email.toUpperCase()}  `;

    expect(service.login(untidyEmail, DEMO_CREDENTIALS.password)).toBe(true);
    expect(service.signedInEmail()).toBe(DEMO_CREDENTIALS.email);
  });

  it('rejects a wrong password and stays signed out', () => {
    expect(service.login(DEMO_CREDENTIALS.email, 'not-the-password')).toBe(false);

    expect(service.isAuthenticated()).toBe(false);
    expect(service.signedInEmail()).toBeNull();
  });

  it('rejects invalid credentials without clearing an existing session', () => {
    service.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    expect(service.login(DEMO_CREDENTIALS.email, 'not-the-password')).toBe(false);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.signedInEmail()).toBe(DEMO_CREDENTIALS.email);
  });

  it('rejects an unknown email', () => {
    expect(service.login('someone.else@example.com', DEMO_CREDENTIALS.password)).toBe(false);

    expect(service.isAuthenticated()).toBe(false);
  });

  it('treats the password as case-sensitive', () => {
    expect(service.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password.toUpperCase())).toBe(
      false,
    );
  });

  it('rejects empty credentials', () => {
    expect(service.login('', '')).toBe(false);
  });

  it('clears the session on logout', () => {
    service.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.signedInEmail()).toBeNull();
  });

  it('can sign in again after signing out', () => {
    service.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    service.logout();

    expect(service.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });
});
