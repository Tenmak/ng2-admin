import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Routes, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { Ng2SmartTableModule } from 'ng2-smart-table/ng2-smart-table.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgaModule } from 'app/theme/nga.module';

import { TablesComponent } from './tables.component';
import { ProfileComponent } from './profiles/profiles.component';

import { ProfileService } from './profiles/profiles.service';
import { ProfileServiceStub } from './profiles/profiles.component.spec';

describe('TablesComponent', () => {
  let fixture: ComponentFixture<TablesComponent>;
  let component: TablesComponent;

  describe('Unit Test', () => {
    // synchronous beforeEach
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          Ng2SmartTableModule,
        ],
        declarations: [
          TablesComponent,
        ],
        schemas: [
          NO_ERRORS_SCHEMA
        ]
      });

      fixture = TestBed.createComponent(TablesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create TablesComponent', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Integration Test', () => {
    // synchronous beforeEach
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          Ng2SmartTableModule,
          TranslateModule.forRoot(),
          NgaModule.forRoot()
        ],
        declarations: [
          TablesComponent,
          ProfileComponent
        ],
        providers: [
          {
            provide: ProfileService, useClass: ProfileServiceStub
          }
        ]
      });

      fixture = TestBed.createComponent(TablesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create TablesComponent with ProfileComponent', () => {
      expect(component).toBeTruthy();
    });
  });
});


