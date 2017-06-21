import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { GlobalState } from './global.state';

import { AppState, InternalStateType } from './app.service';

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
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
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

  constructor(public appState: AppState) {
  }
}
