import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appInterceptor, jwtInterceptor, tokenExpiredInterceptor, unwrapDataInterceptor } from './app-interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SimpleNotificationsModule } from 'angular2-notifications';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        appInterceptor,
        tokenExpiredInterceptor,
        jwtInterceptor,
        unwrapDataInterceptor
      ])
    ),
    provideAnimationsAsync(),
    importProvidersFrom(SimpleNotificationsModule.forRoot())
  ]
};
