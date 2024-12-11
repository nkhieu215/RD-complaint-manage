import { ApplicationConfig, LOCALE_ID, importProvidersFrom, inject } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import {
  Router,
  RouterFeatures,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withNavigationErrorHandler,
  NavigationError,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';

import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import './config/dayjs';
import { httpInterceptorProviders } from './core/interceptor';
import routes from './app.routes';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { AppPageTitleStrategy } from './app-page-title-strategy';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';

const routerFeatures: Array<RouterFeatures> = [
  withComponentInputBinding(),
  withNavigationErrorHandler((e: NavigationError) => {
    const router = inject(Router);
    if (e.error.status === 403) {
      router.navigate(['/accessdenied']);
    } else if (e.error.status === 404) {
      router.navigate(['/404']);
    } else if (e.error.status === 401) {
      router.navigate(['/login']);
    } else {
      router.navigate(['/error']);
    }
  }),
];

const customVietnamese = {
  ...vi_VN,
  Pagination: {
    items_per_page: '/ trang',
    jump_to: 'Đến',
    jump_to_confirm: 'Xác nhận',
    page: 'Trang',
    prev_page: 'Trang trước',
    next_page: 'Trang sau',
    prev_5: '5 trang trước',
    next_5: '5 trang sau',
    prev_3: '3 trang trước',
    next_3: '3 trang sau',
    total: 'Tổng'
  }
};
if (DEBUG_INFO_ENABLED) {
  routerFeatures.push(withDebugTracing());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, ...routerFeatures),
    importProvidersFrom(BrowserModule),
    // Set this to true to enable service worker (PWA)
    importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })),
    importProvidersFrom(HttpClientModule),
    Title,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
    { provide: TitleStrategy, useClass: AppPageTitleStrategy },
    provideAnimations(),
    { provide: NZ_I18N, useValue: customVietnamese }
    // jhipster-needle-angular-add-module JHipster will add new module here
  ],
};
