import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { DEMO_CREDENTIALS } from '../../auth/demo-credentials';
import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  let fixture: ComponentFixture<AppShellComponent>;
  let host: HTMLElement;
  let authService: AuthService;
  let navigate: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    authService.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(AppShellComponent);
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

  it('links to the deals page from its navigation', () => {
    const link = requireElement<HTMLAnchorElement>('nav a');

    expect(link.textContent).toContain('Deals');
    expect(link.getAttribute('href')).toBe('/deals');
  });

  it('names the signed-in user', () => {
    expect(host.textContent).toContain(DEMO_CREDENTIALS.email);
  });

  it('gives the routed page somewhere to render', () => {
    expect(host.querySelector('router-outlet')).not.toBeNull();
  });

  it('signs the user out and returns them to the login page', () => {
    requireElement<HTMLButtonElement>('.shell-header__logout').click();
    fixture.detectChanges();

    expect(authService.isAuthenticated()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
    expect(host.textContent).not.toContain(DEMO_CREDENTIALS.email);
  });
});
