import { Routes } from '@angular/router';
import { AppShellComponent } from './layout/shell/app-shell.component';
import { LoginPageComponent } from './features/auth/login-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: AppShellComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
