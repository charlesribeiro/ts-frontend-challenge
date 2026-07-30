import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guard';
import { AppShellComponent } from './core/layout/app-shell/app-shell.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { DealsPageComponent } from './features/deals/pages/deals-page/deals-page.component';

/**
 * Login sits outside the shell so the signed-out page has no navigation or
 * logout control on it. Everything else renders inside the shell, which is
 * guarded once as a group rather than route by route.
 */
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Sign in',
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'deals',
        component: DealsPageComponent,
        title: 'Deals',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'deals',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
