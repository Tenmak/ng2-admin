import { NgModule, ApplicationRef } from '@angular/core';
// import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { GlobalState } from './global.state';

import { AppState, InternalStateType } from './app.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// Application wide providers used for theming
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export interface StoreType {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

@NgModule({
  imports: [
    BrowserModule,
    // HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    PagesModule,
    routing
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    APP_PROVIDERS
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}
