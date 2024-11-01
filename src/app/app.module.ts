import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';

import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { ContentLayoutComponent } from './layouts/content/content-layout.component';
import { FullLayoutComponent } from './layouts/full/full-layout.component';

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { WINDOW_PROVIDERS } from './shared/services/window.service';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './shared/app-state';
import { UserEffects } from './shared/app-state/effects';

import { EffectsModule } from '@ngrx/effects';

// import { AppMaterialModule } from './app-material/app-material.module';
// import { AccountsService } from './shared/services/accounts.service';

// tslint:disable-next-line:prefer-const
let firebaseConfig = {
  apiKey: 'YOUR_API_KEY', // YOUR_API_KEY
  authDomain: 'YOUR_AUTH_DOMAIN', // YOUR_AUTH_DOMAIN
  databaseURL: 'YOUR_DATABASE_URL', // YOUR_DATABASE_URL
  projectId: 'YOUR_PROJECT_ID', // YOUR_PROJECT_ID
  storageBucket: 'YOUR_STORAGE_BUCKET', // YOUR_STORAGE_BUCKET
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID', // YOUR_MESSAGING_SENDER_ID
  appId: 'YOUR_APP_ID', // YOUR_APP_ID
  measurementId: 'YOUR_MEASUREMENT_ID' // YOUR_MEASUREMENT_ID
};


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    NgbModule,
    // AppMaterialModule,
    NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PerfectScrollbarModule,
    // ngrx related imports
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    EffectsModule.forRoot([UserEffects])
  ],
  providers: [
    // AccountsService,
    AuthService,
    AuthGuard,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    WINDOW_PROVIDERS
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
