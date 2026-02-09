import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/services/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService, router: Router) => {
        return () => {
          // Validar token na inicialização
          if (!authService.isTokenValid()) {
            authService.logout();
            router.navigate(['/login']);
          }
        };
      },
      deps: [AuthService, Router],
      multi: true
    }
  ]
};
